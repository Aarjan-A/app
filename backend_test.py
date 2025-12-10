#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for Doerly App
Tests all authentication, user, payment, task, automation, notification, and helper endpoints
"""

import requests
import json
import uuid
from datetime import datetime
import sys

# Get backend URL from frontend .env
BACKEND_URL = "https://runna-dark-navy.preview.emergentagent.com/api"

class DoerlyAPITester:
    def __init__(self):
        self.base_url = BACKEND_URL
        self.user_token = None
        self.helper_token = None
        self.user_id = None
        self.helper_id = None
        self.test_results = []
        
    def log_result(self, test_name, success, message="", response_data=None):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {message}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "message": message,
            "response": response_data
        })
        
    def make_request(self, method, endpoint, data=None, params=None, files=None):
        """Make HTTP request with error handling"""
        url = f"{self.base_url}{endpoint}"
        try:
            if method == "GET":
                response = requests.get(url, params=params, timeout=30)
            elif method == "POST":
                if files:
                    response = requests.post(url, data=data, files=files, timeout=30)
                else:
                    response = requests.post(url, json=data, timeout=30)
            elif method == "PATCH":
                response = requests.patch(url, json=data, params=params, timeout=30)
            elif method == "DELETE":
                response = requests.delete(url, params=params, timeout=30)
            else:
                raise ValueError(f"Unsupported method: {method}")
                
            return response
        except requests.exceptions.RequestException as e:
            print(f"Request failed: {e}")
            return None
    
    def test_health_check(self):
        """Test API health check"""
        print("\n=== Testing API Health Check ===")
        response = self.make_request("GET", "/")
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("message") == "Doerly API is running":
                self.log_result("API Health Check", True, "API is running")
                return True
            else:
                self.log_result("API Health Check", False, f"Unexpected response: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("API Health Check", False, f"Failed with status: {status}")
        return False
    
    def test_user_registration(self):
        """Test user registration"""
        print("\n=== Testing User Registration ===")
        
        # Test regular user registration
        user_email = f"testuser_{uuid.uuid4().hex[:8]}@example.com"
        user_data = {
            "email": user_email,
            "password": "securepassword123",
            "full_name": "Test User",
            "user_type": "user"
        }
        
        response = self.make_request("POST", "/auth/register", user_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                self.user_token = data["token"]
                self.user_id = data["user"]["id"]
                self.log_result("User Registration", True, f"User registered: {user_email}")
                
                # Test helper registration
                helper_email = f"testhelper_{uuid.uuid4().hex[:8]}@example.com"
                helper_data = {
                    "email": helper_email,
                    "password": "helperpassword123",
                    "full_name": "Test Helper",
                    "user_type": "helper"
                }
                
                helper_response = self.make_request("POST", "/auth/register", helper_data)
                if helper_response and helper_response.status_code == 200:
                    helper_data_resp = helper_response.json()
                    self.helper_token = helper_data_resp["token"]
                    self.helper_id = helper_data_resp["user"]["id"]
                    self.log_result("Helper Registration", True, f"Helper registered: {helper_email}")
                    return True
                else:
                    self.log_result("Helper Registration", False, f"Status: {helper_response.status_code if helper_response else 'No response'}")
            else:
                self.log_result("User Registration", False, f"Missing token or user in response: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("User Registration", False, f"Failed with status: {status}")
        return False
    
    def test_user_login(self):
        """Test user login"""
        print("\n=== Testing User Login ===")
        
        # We need to register a user first for login test
        login_email = f"logintest_{uuid.uuid4().hex[:8]}@example.com"
        reg_data = {
            "email": login_email,
            "password": "loginpassword123",
            "full_name": "Login Test User",
            "user_type": "user"
        }
        
        # Register user
        reg_response = self.make_request("POST", "/auth/register", reg_data)
        if not reg_response or reg_response.status_code != 200:
            self.log_result("User Login Setup", False, "Failed to register user for login test")
            return False
        
        # Test login
        login_data = {
            "email": login_email,
            "password": "loginpassword123"
        }
        
        response = self.make_request("POST", "/auth/login", login_data)
        
        if response and response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                self.log_result("User Login", True, f"Login successful for: {login_email}")
                
                # Test invalid credentials
                invalid_data = {
                    "email": login_email,
                    "password": "wrongpassword"
                }
                invalid_response = self.make_request("POST", "/auth/login", invalid_data)
                if invalid_response and invalid_response.status_code == 401:
                    self.log_result("Invalid Login Test", True, "Correctly rejected invalid credentials")
                    return True
                else:
                    self.log_result("Invalid Login Test", False, "Should have rejected invalid credentials")
            else:
                self.log_result("User Login", False, f"Missing token or user in response: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("User Login", False, f"Failed with status: {status}")
        return False
    
    def test_user_profile(self):
        """Test user profile endpoint"""
        print("\n=== Testing User Profile ===")
        
        if not self.user_token:
            self.log_result("User Profile", False, "No user token available")
            return False
        
        response = self.make_request("GET", "/users/profile", params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if "email" in data and "full_name" in data and "user_type" in data:
                self.log_result("User Profile", True, f"Profile retrieved for user: {data.get('email')}")
                return True
            else:
                self.log_result("User Profile", False, f"Missing profile fields: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("User Profile", False, f"Failed with status: {status}")
        return False
    
    def test_user_wallet(self):
        """Test user wallet endpoint"""
        print("\n=== Testing User Wallet ===")
        
        if not self.user_token:
            self.log_result("User Wallet", False, "No user token available")
            return False
        
        response = self.make_request("GET", "/users/wallet", params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if "balance" in data:
                self.log_result("User Wallet", True, f"Wallet balance: {data['balance']}")
                return True
            else:
                self.log_result("User Wallet", False, f"Missing balance field: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("User Wallet", False, f"Failed with status: {status}")
        return False
    
    def test_payment_operations(self):
        """Test payment operations: add funds, withdraw, send money"""
        print("\n=== Testing Payment Operations ===")
        
        if not self.user_token or not self.helper_token:
            self.log_result("Payment Operations", False, "Missing user or helper tokens")
            return False
        
        success_count = 0
        
        # Test add funds
        add_funds_data = {"amount": 100.0}
        response = self.make_request("POST", "/payments/add-funds", add_funds_data, params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log_result("Add Funds", True, "Successfully added $100 to wallet")
                success_count += 1
            else:
                self.log_result("Add Funds", False, f"Add funds failed: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Add Funds", False, f"Failed with status: {status}")
        
        # Test withdraw funds
        withdraw_data = {"amount": 25.0}
        response = self.make_request("POST", "/payments/withdraw", withdraw_data, params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log_result("Withdraw Funds", True, "Successfully withdrew $25 from wallet")
                success_count += 1
            else:
                self.log_result("Withdraw Funds", False, f"Withdraw failed: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Withdraw Funds", False, f"Failed with status: {status}")
        
        # Get helper email for send money test
        helper_profile = self.make_request("GET", "/users/profile", params={"token": self.helper_token})
        if not helper_profile or helper_profile.status_code != 200:
            self.log_result("Send Money Setup", False, "Could not get helper profile")
            return success_count >= 2
        
        helper_email = helper_profile.json().get("email")
        
        # Test send money
        send_data = {"amount": 20.0, "recipient_email": helper_email}
        response = self.make_request("POST", "/payments/send", send_data, params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log_result("Send Money", True, f"Successfully sent $20 to {helper_email}")
                success_count += 1
            else:
                self.log_result("Send Money", False, f"Send money failed: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Send Money", False, f"Failed with status: {status}")
        
        return success_count >= 2
    
    def test_payment_transactions(self):
        """Test payment transaction history"""
        print("\n=== Testing Payment Transactions ===")
        
        if not self.user_token:
            self.log_result("Payment Transactions", False, "No user token available")
            return False
        
        response = self.make_request("GET", "/payments/transactions", params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("Payment Transactions", True, f"Retrieved {len(data)} transactions")
                return True
            else:
                self.log_result("Payment Transactions", False, f"Expected list, got: {type(data)}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Payment Transactions", False, f"Failed with status: {status}")
        return False
    
    def test_task_operations(self):
        """Test task CRUD operations"""
        print("\n=== Testing Task Operations ===")
        
        if not self.user_token:
            self.log_result("Task Operations", False, "No user token available")
            return False
        
        success_count = 0
        task_id = None
        
        # Test create task
        task_data = {
            "title": "Test Task for API Testing",
            "description": "This is a test task created by the API test suite",
            "task_type": "helper",
            "urgency": "high",
            "estimated_cost": 50.0
        }
        
        response = self.make_request("POST", "/tasks", task_data, params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if "id" in data and data.get("title") == task_data["title"]:
                task_id = data["id"]
                self.log_result("Create Task", True, f"Task created with ID: {task_id}")
                success_count += 1
            else:
                self.log_result("Create Task", False, f"Invalid task response: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Create Task", False, f"Failed with status: {status}")
        
        # Test get all tasks
        response = self.make_request("GET", "/tasks", params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                self.log_result("Get All Tasks", True, f"Retrieved {len(data)} tasks")
                success_count += 1
            else:
                self.log_result("Get All Tasks", False, f"Expected non-empty list, got: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Get All Tasks", False, f"Failed with status: {status}")
        
        # Test get specific task
        if task_id:
            response = self.make_request("GET", f"/tasks/{task_id}", params={"token": self.user_token})
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get("id") == task_id:
                    self.log_result("Get Specific Task", True, f"Retrieved task: {task_id}")
                    success_count += 1
                else:
                    self.log_result("Get Specific Task", False, f"Task ID mismatch: {data}")
            else:
                status = response.status_code if response else "No response"
                self.log_result("Get Specific Task", False, f"Failed with status: {status}")
            
            # Test update task status
            response = self.make_request("PATCH", f"/tasks/{task_id}/status", 
                                       params={"token": self.user_token, "status": "in_progress"})
            
            if response and response.status_code == 200:
                data = response.json()
                if data.get("success"):
                    self.log_result("Update Task Status", True, "Task status updated to in_progress")
                    success_count += 1
                else:
                    self.log_result("Update Task Status", False, f"Update failed: {data}")
            else:
                status = response.status_code if response else "No response"
                self.log_result("Update Task Status", False, f"Failed with status: {status}")
        
        return success_count >= 3
    
    def test_automation_operations(self):
        """Test automation CRUD operations"""
        print("\n=== Testing Automation Operations ===")
        
        if not self.user_token:
            self.log_result("Automation Operations", False, "No user token available")
            return False
        
        success_count = 0
        automation_id = None
        
        # Test create automation
        response = self.make_request("POST", "/automations", 
                                   params={"token": self.user_token, "automation_type": "daily_reminder", "schedule": "0 9 * * *"})
        
        if response and response.status_code == 200:
            data = response.json()
            if "id" in data and data.get("automation_type") == "daily_reminder":
                automation_id = data["id"]
                self.log_result("Create Automation", True, f"Automation created with ID: {automation_id}")
                success_count += 1
            else:
                self.log_result("Create Automation", False, f"Invalid automation response: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Create Automation", False, f"Failed with status: {status}")
        
        # Test get automations
        response = self.make_request("GET", "/automations", params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("Get Automations", True, f"Retrieved {len(data)} automations")
                success_count += 1
            else:
                self.log_result("Get Automations", False, f"Expected list, got: {type(data)}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Get Automations", False, f"Failed with status: {status}")
        
        # Test toggle automation
        if automation_id:
            response = self.make_request("PATCH", f"/automations/{automation_id}/toggle", 
                                       params={"token": self.user_token})
            
            if response and response.status_code == 200:
                data = response.json()
                if "active" in data:
                    self.log_result("Toggle Automation", True, f"Automation toggled to: {data['active']}")
                    success_count += 1
                else:
                    self.log_result("Toggle Automation", False, f"Missing active field: {data}")
            else:
                status = response.status_code if response else "No response"
                self.log_result("Toggle Automation", False, f"Failed with status: {status}")
        
        return success_count >= 2
    
    def test_notification_operations(self):
        """Test notification operations"""
        print("\n=== Testing Notification Operations ===")
        
        if not self.user_token:
            self.log_result("Notification Operations", False, "No user token available")
            return False
        
        success_count = 0
        
        # Test get notifications
        response = self.make_request("GET", "/notifications", params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("Get Notifications", True, f"Retrieved {len(data)} notifications")
                success_count += 1
                
                # If there are notifications, test mark as read
                if len(data) > 0:
                    notif_id = data[0].get("id")
                    if notif_id:
                        read_response = self.make_request("PATCH", f"/notifications/{notif_id}/read", 
                                                        params={"token": self.user_token})
                        
                        if read_response and read_response.status_code == 200:
                            read_data = read_response.json()
                            if read_data.get("success"):
                                self.log_result("Mark Notification Read", True, f"Notification {notif_id} marked as read")
                                success_count += 1
                            else:
                                self.log_result("Mark Notification Read", False, f"Mark read failed: {read_data}")
                        else:
                            status = read_response.status_code if read_response else "No response"
                            self.log_result("Mark Notification Read", False, f"Failed with status: {status}")
                else:
                    self.log_result("Mark Notification Read", True, "No notifications to mark as read (expected)")
                    success_count += 1
            else:
                self.log_result("Get Notifications", False, f"Expected list, got: {type(data)}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Get Notifications", False, f"Failed with status: {status}")
        
        return success_count >= 1
    
    def test_helper_operations(self):
        """Test helper operations"""
        print("\n=== Testing Helper Operations ===")
        
        if not self.user_token:
            self.log_result("Helper Operations", False, "No user token available")
            return False
        
        # Test get helpers
        response = self.make_request("GET", "/helpers", params={"token": self.user_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                self.log_result("Get Helpers", True, f"Retrieved {len(data)} helpers")
                return True
            else:
                self.log_result("Get Helpers", False, f"Expected list, got: {type(data)}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Get Helpers", False, f"Failed with status: {status}")
        return False
    
    def test_user_account_deletion(self):
        """Test user account deletion (run last)"""
        print("\n=== Testing User Account Deletion ===")
        
        # Create a separate user for deletion test
        delete_email = f"deletetest_{uuid.uuid4().hex[:8]}@example.com"
        reg_data = {
            "email": delete_email,
            "password": "deletepassword123",
            "full_name": "Delete Test User",
            "user_type": "user"
        }
        
        # Register user
        reg_response = self.make_request("POST", "/auth/register", reg_data)
        if not reg_response or reg_response.status_code != 200:
            self.log_result("Account Deletion Setup", False, "Failed to register user for deletion test")
            return False
        
        delete_token = reg_response.json().get("token")
        
        # Test account deletion
        response = self.make_request("DELETE", "/users/account", params={"token": delete_token})
        
        if response and response.status_code == 200:
            data = response.json()
            if data.get("success"):
                self.log_result("Delete User Account", True, f"Account deleted for: {delete_email}")
                return True
            else:
                self.log_result("Delete User Account", False, f"Deletion failed: {data}")
        else:
            status = response.status_code if response else "No response"
            self.log_result("Delete User Account", False, f"Failed with status: {status}")
        return False
    
    def run_all_tests(self):
        """Run all API tests"""
        print(f"🚀 Starting Doerly API Test Suite")
        print(f"Backend URL: {self.base_url}")
        print("=" * 60)
        
        # Test sequence
        tests = [
            ("API Health Check", self.test_health_check),
            ("User Registration", self.test_user_registration),
            ("User Login", self.test_user_login),
            ("User Profile", self.test_user_profile),
            ("User Wallet", self.test_user_wallet),
            ("Payment Operations", self.test_payment_operations),
            ("Payment Transactions", self.test_payment_transactions),
            ("Task Operations", self.test_task_operations),
            ("Automation Operations", self.test_automation_operations),
            ("Notification Operations", self.test_notification_operations),
            ("Helper Operations", self.test_helper_operations),
            ("User Account Deletion", self.test_user_account_deletion),
        ]
        
        passed = 0
        total = len(tests)
        
        for test_name, test_func in tests:
            try:
                if test_func():
                    passed += 1
            except Exception as e:
                self.log_result(test_name, False, f"Exception: {str(e)}")
        
        # Summary
        print("\n" + "=" * 60)
        print(f"🏁 TEST SUMMARY: {passed}/{total} tests passed")
        print("=" * 60)
        
        # Detailed results
        print("\n📊 DETAILED RESULTS:")
        for result in self.test_results:
            status = "✅" if result["success"] else "❌"
            print(f"{status} {result['test']}: {result['message']}")
        
        return passed, total

def main():
    """Main test runner"""
    tester = DoerlyAPITester()
    passed, total = tester.run_all_tests()
    
    if passed == total:
        print(f"\n🎉 All tests passed! The Doerly API is working correctly.")
        sys.exit(0)
    else:
        print(f"\n⚠️  {total - passed} tests failed. Please check the API implementation.")
        sys.exit(1)

if __name__ == "__main__":
    main()