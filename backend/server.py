from fastapi import FastAPI, APIRouter, HTTPException, Depends, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt
import base64
from emergentintegrations.llm.chat import LlmChat, UserMessage, FileContentWithMimeType, ImageContent
import asyncio

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

# JWT Config
JWT_SECRET = os.environ.get('JWT_SECRET', 'doerly_secret_key')
JWT_ALGORITHM = 'HS256'
EMERGENT_LLM_KEY = os.environ.get('EMERGENT_LLM_KEY', '')

app = FastAPI()
api_router = APIRouter(prefix="/api")

# ============= MODELS =============
class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    user_type: str = 'user'  # user or helper

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    full_name: str
    user_type: str
    wallet_balance: float = 0.0
    kyc_status: str = 'pending'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TaskCreate(BaseModel):
    title: str
    description: str
    task_type: str  # ai or helper
    urgency: str = 'medium'
    estimated_cost: Optional[float] = None

class Task(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    description: str
    task_type: str
    status: str = 'pending'
    created_by: str
    assigned_to: Optional[str] = None
    urgency: str = 'medium'
    estimated_cost: Optional[float] = None
    proof_urls: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Transaction(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_id: str
    from_user: str
    to_user: Optional[str] = None
    amount: float
    status: str = 'escrow'
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Automation(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    automation_type: str
    schedule: str
    active: bool = True
    last_run: Optional[datetime] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Notification(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    task_id: Optional[str] = None
    message: str
    read: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Dispute(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    task_id: str
    user_id: str
    helper_id: str
    reason: str
    status: str = 'open'
    resolution: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ============= AUTH UTILITIES =============
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str) -> str:
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + timedelta(days=7)
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(token: str) -> str:
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload['user_id']
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

# ============= ROOT ROUTE =============
@api_router.get("/")
async def root():
    return {"message": "Doerly API is running", "status": "healthy"}

# ============= AUTH ROUTES =============
@api_router.post("/auth/register")
async def register(user_data: UserRegister):
    existing = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing:
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        user_type=user_data.user_type
    )
    
    user_dict = user.model_dump()
    user_dict['password'] = hash_password(user_data.password)
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    token = create_token(user.id)
    
    return {"token": token, "user": user}

@api_router.post("/auth/login")
async def login(credentials: UserLogin):
    user_doc = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user_doc or not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if isinstance(user_doc['created_at'], str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    user_doc.pop('password', None)
    token = create_token(user_doc['id'])
    
    return {"token": token, "user": user_doc}

# ============= USER ROUTES =============
@api_router.get("/users/profile")
async def get_profile(token: str):
    user_id = await get_current_user(token)
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "password": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@api_router.get("/users/wallet")
async def get_wallet(token: str):
    user_id = await get_current_user(token)
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"balance": user.get('wallet_balance', 0.0)}

@api_router.delete("/users/account")
async def delete_account(token: str):
    user_id = await get_current_user(token)
    
    # Delete user data
    await db.users.delete_one({"id": user_id})
    await db.tasks.delete_many({"created_by": user_id})
    await db.automations.delete_many({"user_id": user_id})
    await db.notifications.delete_many({"user_id": user_id})
    await db.transactions.delete_many({"from_user": user_id})
    
    return {"success": True, "message": "Account deleted successfully"}

# ============= TASK ROUTES =============
@api_router.post("/tasks", response_model=Task)
async def create_task(task_data: TaskCreate, token: str):
    user_id = await get_current_user(token)
    
    task = Task(
        title=task_data.title,
        description=task_data.description,
        task_type=task_data.task_type,
        urgency=task_data.urgency,
        estimated_cost=task_data.estimated_cost or 10.0,
        created_by=user_id
    )
    
    task_dict = task.model_dump()
    task_dict['created_at'] = task_dict['created_at'].isoformat()
    
    await db.tasks.insert_one(task_dict)
    return task

@api_router.get("/tasks", response_model=List[Task])
async def get_tasks(token: str):
    user_id = await get_current_user(token)
    tasks = await db.tasks.find({"created_by": user_id}, {"_id": 0}).to_list(100)
    
    for task in tasks:
        if isinstance(task['created_at'], str):
            task['created_at'] = datetime.fromisoformat(task['created_at'])
    
    return tasks

@api_router.get("/tasks/{task_id}", response_model=Task)
async def get_task(task_id: str, token: str):
    await get_current_user(token)
    task = await db.tasks.find_one({"id": task_id}, {"_id": 0})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    if isinstance(task['created_at'], str):
        task['created_at'] = datetime.fromisoformat(task['created_at'])
    
    return task

@api_router.patch("/tasks/{task_id}/status")
async def update_task_status(task_id: str, status: str, token: str):
    await get_current_user(token)
    result = await db.tasks.update_one({"id": task_id}, {"$set": {"status": status}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"success": True}

# ============= AI ROUTES =============
@api_router.post("/ai/analyze-image")
async def analyze_image(file: UploadFile = File(...), token: str = Form(...)):
    await get_current_user(token)
    
    try:
        image_data = await file.read()
        base64_image = base64.b64encode(image_data).decode('utf-8')
        
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message="You are an AI that extracts tasks and information from images."
        ).with_model("openai", "gpt-4o")
        
        image_content = ImageContent(image_base64=base64_image)
        message = UserMessage(
            text="Analyze this image and extract any tasks, bills, forms, or actionable items. Return a structured JSON with: title, description, urgency (low/medium/high), estimated_cost.",
            file_contents=[image_content]
        )
        
        response = await chat.send_message(message)
        return {"analysis": response}
    except Exception as e:
        return {"error": str(e), "analysis": "Unable to analyze image"}

@api_router.post("/ai/extract-task")
async def extract_task(text: str, token: str):
    await get_current_user(token)
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=str(uuid.uuid4()),
            system_message="Extract actionable tasks from user input."
        ).with_model("openai", "gpt-5.1")
        
        message = UserMessage(
            text=f"Extract task from: {text}. Return JSON with title, description, task_type (ai/helper), urgency."
        )
        
        response = await chat.send_message(message)
        return {"task_suggestion": response}
    except Exception as e:
        return {"error": str(e)}

# ============= HELPER ROUTES =============
@api_router.get("/helpers")
async def get_helpers(token: str):
    await get_current_user(token)
    helpers = await db.users.find({"user_type": "helper"}, {"_id": 0, "password": 0}).to_list(50)
    return helpers

@api_router.post("/helpers/accept-task")
async def accept_task(task_id: str, token: str):
    helper_id = await get_current_user(token)
    
    result = await db.tasks.update_one(
        {"id": task_id, "status": "pending"},
        {"$set": {"assigned_to": helper_id, "status": "in_progress"}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=400, detail="Task not available")
    
    return {"success": True}

# ============= PAYMENT ROUTES =============
class PaymentRequest(BaseModel):
    amount: float
    recipient_email: Optional[str] = None

@api_router.post("/payments/add-funds")
async def add_funds(payment: PaymentRequest, token: str):
    user_id = await get_current_user(token)
    
    # Update user wallet balance
    result = await db.users.update_one(
        {"id": user_id},
        {"$inc": {"wallet_balance": payment.amount}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create transaction record
    transaction = Transaction(
        task_id="add_funds",
        from_user=user_id,
        amount=payment.amount,
        status='completed'
    )
    
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    return {"success": True, "message": "Funds added successfully"}

@api_router.post("/payments/withdraw")
async def withdraw_funds(payment: PaymentRequest, token: str):
    user_id = await get_current_user(token)
    
    # Check balance
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user or user.get('wallet_balance', 0) < payment.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Update user wallet balance
    result = await db.users.update_one(
        {"id": user_id},
        {"$inc": {"wallet_balance": -payment.amount}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create transaction record
    transaction = Transaction(
        task_id="withdraw",
        from_user=user_id,
        amount=payment.amount,
        status='completed'
    )
    
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    return {"success": True, "message": "Withdrawal initiated successfully"}

@api_router.post("/payments/send")
async def send_money(payment: PaymentRequest, token: str):
    user_id = await get_current_user(token)
    
    if not payment.recipient_email:
        raise HTTPException(status_code=400, detail="Recipient email required")
    
    # Check balance
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user or user.get('wallet_balance', 0) < payment.amount:
        raise HTTPException(status_code=400, detail="Insufficient balance")
    
    # Find recipient
    recipient = await db.users.find_one({"email": payment.recipient_email}, {"_id": 0})
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")
    
    # Transfer funds
    await db.users.update_one(
        {"id": user_id},
        {"$inc": {"wallet_balance": -payment.amount}}
    )
    await db.users.update_one(
        {"id": recipient['id']},
        {"$inc": {"wallet_balance": payment.amount}}
    )
    
    # Create transaction record
    transaction = Transaction(
        task_id="send_money",
        from_user=user_id,
        to_user=recipient['id'],
        amount=payment.amount,
        status='completed'
    )
    
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    await db.transactions.insert_one(trans_dict)
    
    return {"success": True, "message": "Money sent successfully"}

@api_router.post("/payments/escrow")
async def create_escrow(task_id: str, amount: float, token: str):
    user_id = await get_current_user(token)
    
    transaction = Transaction(
        task_id=task_id,
        from_user=user_id,
        amount=amount,
        status='escrow'
    )
    
    trans_dict = transaction.model_dump()
    trans_dict['created_at'] = trans_dict['created_at'].isoformat()
    
    await db.transactions.insert_one(trans_dict)
    return transaction

@api_router.post("/payments/release")
async def release_payment(transaction_id: str, token: str):
    await get_current_user(token)
    
    result = await db.transactions.update_one(
        {"id": transaction_id},
        {"$set": {"status": "completed"}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    return {"success": True}

@api_router.get("/payments/transactions")
async def get_transactions(token: str):
    user_id = await get_current_user(token)
    transactions = await db.transactions.find({"from_user": user_id}, {"_id": 0}).to_list(100)
    return transactions

# ============= AUTOMATION ROUTES =============
@api_router.post("/automations", response_model=Automation)
async def create_automation(automation_type: str, schedule: str, token: str):
    user_id = await get_current_user(token)
    
    automation = Automation(
        user_id=user_id,
        automation_type=automation_type,
        schedule=schedule
    )
    
    auto_dict = automation.model_dump()
    auto_dict['created_at'] = auto_dict['created_at'].isoformat()
    
    await db.automations.insert_one(auto_dict)
    return automation

@api_router.get("/automations")
async def get_automations(token: str):
    user_id = await get_current_user(token)
    automations = await db.automations.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    return automations

@api_router.patch("/automations/{auto_id}/toggle")
async def toggle_automation(auto_id: str, token: str):
    user_id = await get_current_user(token)
    
    automation = await db.automations.find_one({"id": auto_id, "user_id": user_id})
    if not automation:
        raise HTTPException(status_code=404, detail="Automation not found")
    
    new_status = not automation.get('active', True)
    await db.automations.update_one({"id": auto_id}, {"$set": {"active": new_status}})
    
    return {"active": new_status}

# ============= NOTIFICATION ROUTES =============
@api_router.get("/notifications")
async def get_notifications(token: str):
    user_id = await get_current_user(token)
    notifications = await db.notifications.find({"user_id": user_id}, {"_id": 0}).sort("created_at", -1).to_list(50)
    return notifications

@api_router.patch("/notifications/{notif_id}/read")
async def mark_read(notif_id: str, token: str):
    await get_current_user(token)
    await db.notifications.update_one({"id": notif_id}, {"$set": {"read": True}})
    return {"success": True}

# ============= DISPUTE ROUTES =============
@api_router.post("/disputes", response_model=Dispute)
async def create_dispute(task_id: str, helper_id: str, reason: str, token: str):
    user_id = await get_current_user(token)
    
    dispute = Dispute(
        task_id=task_id,
        user_id=user_id,
        helper_id=helper_id,
        reason=reason
    )
    
    dispute_dict = dispute.model_dump()
    dispute_dict['created_at'] = dispute_dict['created_at'].isoformat()
    
    await db.disputes.insert_one(dispute_dict)
    return dispute

@api_router.get("/disputes")
async def get_disputes(token: str):
    user_id = await get_current_user(token)
    disputes = await db.disputes.find({"user_id": user_id}, {"_id": 0}).to_list(100)
    return disputes

# ============= INCLUDE ROUTER =============
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()