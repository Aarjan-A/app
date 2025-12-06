import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/utils/api';
import { ArrowLeft, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, CreditCard, Send, Download } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function Wallet() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddFundsDialog, setShowAddFundsDialog] = useState(false);
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showSendDialog, setShowSendDialog] = useState(false);
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchWallet();
    fetchTransactions();
  }, []);

  const fetchWallet = async () => {
    try {
      const response = await api.get('/users/wallet', {
        params: { token },
      });
      setWallet(response.data);
    } catch (error) {
      toast.error('Failed to load wallet');
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const response = await api.get('/payments/transactions', {
        params: { token },
      });
      setTransactions(response.data);
    } catch (error) {
      console.error('Failed to load transactions');
    }
  };

  const handleAddFunds = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      await api.post('/payments/add-funds', 
        { amount: parseFloat(amount) },
        { params: { token } }
      );
      toast.success('Funds added successfully!');
      setShowAddFundsDialog(false);
      setAmount('');
      fetchWallet();
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to add funds');
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (parseFloat(amount) > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await api.post('/payments/withdraw', 
        { amount: parseFloat(amount) },
        { params: { token } }
      );
      toast.success('Withdrawal initiated successfully!');
      setShowWithdrawDialog(false);
      setAmount('');
      fetchWallet();
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to process withdrawal');
    }
  };

  const handleSendMoney = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!recipientEmail) {
      toast.error('Please enter recipient email');
      return;
    }

    if (parseFloat(amount) > wallet.balance) {
      toast.error('Insufficient balance');
      return;
    }

    try {
      await api.post('/payments/send', 
        { amount: parseFloat(amount), recipient_email: recipientEmail },
        { params: { token } }
      );
      toast.success('Money sent successfully!');
      setShowSendDialog(false);
      setAmount('');
      setRecipientEmail('');
      fetchWallet();
      fetchTransactions();
    } catch (error) {
      toast.error('Failed to send money');
    }
  };

  return (
    <div data-testid="wallet-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            data-testid="back-button"
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-light text-2xl text-white">Wallet</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Balance Card */}
        <div className="glass-card mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <WalletIcon className="w-8 h-8 text-blue-400" />
              <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                Available Balance
              </span>
            </div>
            <h2
              className="font-heading text-6xl text-white mb-6"
              data-testid="wallet-balance"
            >
              ${wallet.balance.toFixed(2)}
            </h2>
            <div className="flex gap-4">
              <Button 
                onClick={() => setShowAddFundsDialog(true)}
                className="btn-primary" 
                data-testid="add-funds-button"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Funds
              </Button>
              <Button 
                onClick={() => setShowWithdrawDialog(true)}
                className="btn-secondary" 
                data-testid="withdraw-button"
              >
                <Download className="w-5 h-5 mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <button 
            onClick={() => toast.info('Cards management - Coming soon!')}
            className="glass-card text-center py-8 hover:scale-105 transition-all cursor-pointer"
          >
            <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300 font-medium">Cards</span>
          </button>
          <button 
            onClick={() => setShowSendDialog(true)}
            className="glass-card text-center py-8 hover:scale-105 transition-all cursor-pointer"
          >
            <Send className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300 font-medium">Send</span>
          </button>
          <button 
            onClick={() => toast.info('Request money - Coming soon!')}
            className="glass-card text-center py-8 hover:scale-105 transition-all cursor-pointer"
          >
            <ArrowDownLeft className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300 font-medium">Request</span>
          </button>
        </div>

        {/* Transactions */}
        <div className="glass-card">
          <h3 className="font-heading text-2xl text-white mb-6">Recent Transactions</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-12">
              <WalletIcon className="w-16 h-16 text-slate-600 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  data-testid={`transaction-${transaction.id}`}
                  className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <ArrowUpRight className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Task Payment</p>
                      <p className="text-slate-400 text-sm">{transaction.status}</p>
                    </div>
                  </div>
                  <span className="text-white font-medium text-lg">${transaction.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Funds Dialog */}
      <Dialog open={showAddFundsDialog} onOpenChange={setShowAddFundsDialog}>
        <DialogContent className="bg-slate-900 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Add Funds</DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter the amount you want to add to your wallet
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-950/50 border-white/10 text-white h-14 text-lg"
            />
            <div className="flex gap-3">
              <Button onClick={() => setAmount('10')} className="flex-1 btn-secondary">$10</Button>
              <Button onClick={() => setAmount('50')} className="flex-1 btn-secondary">$50</Button>
              <Button onClick={() => setAmount('100')} className="flex-1 btn-secondary">$100</Button>
            </div>
            <Button onClick={handleAddFunds} className="w-full btn-primary">
              Add Funds
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdrawDialog} onOpenChange={setShowWithdrawDialog}>
        <DialogContent className="bg-slate-900 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Withdraw Funds</DialogTitle>
            <DialogDescription className="text-slate-400">
              Enter the amount you want to withdraw (Available: ${wallet.balance.toFixed(2)})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-950/50 border-white/10 text-white h-14 text-lg"
            />
            <Button onClick={handleWithdraw} className="w-full btn-primary">
              Withdraw
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Send Money Dialog */}
      <Dialog open={showSendDialog} onOpenChange={setShowSendDialog}>
        <DialogContent className="bg-slate-900 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Send Money</DialogTitle>
            <DialogDescription className="text-slate-400">
              Send money to another Doerly user
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <Input
              type="email"
              placeholder="Recipient email"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              className="bg-slate-950/50 border-white/10 text-white h-14"
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-slate-950/50 border-white/10 text-white h-14 text-lg"
            />
            <Button onClick={handleSendMoney} className="w-full btn-primary">
              Send Money
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}