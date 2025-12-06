import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ArrowLeft, Wallet as WalletIcon, Plus, ArrowUpRight, ArrowDownLeft, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

export default function Wallet() {
  const navigate = useNavigate();
  const [wallet, setWallet] = useState({ balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <div data-testid="wallet-page" className="min-h-screen bg-[#020617]">
      {/* Header */}
      <div className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            data-testid="back-button"
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-light text-2xl text-white">Wallet</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Balance Card */}
        <div className="glass-card mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent" />
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
              <Button className="btn-primary" data-testid="add-funds-button">
                <Plus className="w-5 h-5 mr-2" />
                Add Funds
              </Button>
              <Button className="btn-secondary" data-testid="withdraw-button">
                Withdraw
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card text-center py-6">
            <CreditCard className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300">Cards</span>
          </div>
          <div className="glass-card text-center py-6">
            <ArrowUpRight className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300">Send</span>
          </div>
          <div className="glass-card text-center py-6">
            <ArrowDownLeft className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300">Request</span>
          </div>
        </div>

        {/* Transactions */}
        <div className="glass-card">
          <h3 className="font-heading text-2xl text-white mb-6">Recent Transactions</h3>
          
          {transactions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  data-testid={`transaction-${transaction.id}`}
                  className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <ArrowUpRight className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Task Payment</p>
                      <p className="text-slate-400 text-sm">{transaction.status}</p>
                    </div>
                  </div>
                  <span className="text-white font-medium">${transaction.amount}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
