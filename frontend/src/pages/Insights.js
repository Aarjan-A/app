import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ArrowLeft, TrendingUp, DollarSign, CheckCircle, Clock, BarChart3, PieChart } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function Insights() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [wallet, setWallet] = useState({ balance: 0 });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, walletRes] = await Promise.all([
        api.get('/tasks', { params: { token } }),
        api.get('/users/wallet', { params: { token } })
      ]);
      setTasks(tasksRes.data);
      setWallet(walletRes.data);
    } catch (error) {
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = tasks.filter(t => t.status === 'pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const totalSpent = tasks.reduce((sum, t) => sum + (t.estimated_cost || 0), 0);

  const stats = [
    { icon: CheckCircle, label: 'Completed Tasks', value: completedTasks, color: 'green' },
    { icon: Clock, label: 'Pending Tasks', value: pendingTasks, color: 'yellow' },
    { icon: TrendingUp, label: 'In Progress', value: inProgressTasks, color: 'blue' },
    { icon: DollarSign, label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, color: 'purple' },
  ];

  return (
    <div data-testid="insights-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            data-testid="back-button"
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-light text-2xl text-white">Insights & Analytics</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Your Activity</h2>
          <p className="text-slate-400 text-lg">Track your tasks and spending</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading insights...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                const colorMap = {
                  green: 'bg-green-500/20 text-green-400',
                  yellow: 'bg-yellow-500/20 text-yellow-400',
                  blue: 'bg-blue-500/20 text-blue-400',
                  purple: 'bg-purple-500/20 text-purple-400',
                };
                return (
                  <div key={idx} className="glass-card text-center">
                    <div className={`w-16 h-16 rounded-2xl ${colorMap[stat.color]} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-heading text-4xl text-white mb-2">{stat.value}</h3>
                    <p className="text-slate-400">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Wallet Overview */}
            <div className="glass-card mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="font-heading text-2xl text-white">Wallet Balance</h3>
              </div>
              <div className="text-center py-8">
                <h2 className="font-heading text-6xl text-white mb-2">${wallet.balance.toFixed(2)}</h2>
                <p className="text-slate-400">Available funds</p>
              </div>
            </div>

            {/* Task Distribution */}
            <div className="glass-card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <PieChart className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="font-heading text-2xl text-white">Task Distribution</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">Completed</span>
                    <span className="text-green-400 font-medium">{completedTasks} tasks</span>
                  </div>
                  <div className="w-full bg-slate-950/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-600 to-green-400 h-3 rounded-full transition-all"
                      style={{ width: `${tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">In Progress</span>
                    <span className="text-blue-400 font-medium">{inProgressTasks} tasks</span>
                  </div>
                  <div className="w-full bg-slate-950/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-600 to-blue-400 h-3 rounded-full transition-all"
                      style={{ width: `${tasks.length > 0 ? (inProgressTasks / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-300">Pending</span>
                    <span className="text-yellow-400 font-medium">{pendingTasks} tasks</span>
                  </div>
                  <div className="w-full bg-slate-950/50 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-600 to-yellow-400 h-3 rounded-full transition-all"
                      style={{ width: `${tasks.length > 0 ? (pendingTasks / tasks.length) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}