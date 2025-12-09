import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { Clock, CheckCircle, AlertCircle, BellDot, Settings as SettingsIcon, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function Home() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchUserAndTasks();
  }, []);

  const fetchUserAndTasks = async () => {
    try {
      const [userRes, tasksRes] = await Promise.all([
        api.get('/users/profile', { params: { token } }),
        api.get('/tasks', { params: { token } })
      ]);
      setUser(userRes.data);
      setTasks(tasksRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'in_progress':
        return <div className="w-5 h-5 rounded-full bg-blue-400 animate-pulse" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div data-testid="home-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-xl blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-xl shadow-[0_4px_16px_rgba(59,130,246,0.4)]">
                  <div className="absolute inset-[1px] bg-gradient-to-br from-white/10 to-transparent rounded-[10px]" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="font-heading font-bold text-2xl text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">D</div>
                </div>
              </div>
              <h1 className="font-heading font-light text-2xl text-white">Doerly</h1>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/notifications')}
                data-testid="notifications-button"
                className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <Bell className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/wallet')}
                data-testid="wallet-button"
                className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <WalletIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/settings')}
                data-testid="settings-button"
                className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <SettingsIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Personalized Greeting */}
        {user && (
          <div className="mb-8">
            <h2 className="font-heading font-light text-4xl md:text-5xl text-white mb-2">
              {getGreeting()}, {user.full_name.split(' ')[0]}!
            </h2>
            <p className="font-body text-lg text-slate-400">
              You have {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} in your inbox
            </p>
          </div>
        )}

        {/* Tasks Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-card text-center py-16">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-heading font-bold text-4xl text-blue-400 opacity-50">D</div>
              </div>
            </div>
            <h3 className="font-heading text-2xl text-white mb-2">No tasks yet</h3>
            <p className="text-slate-400 mb-6">Create your first task to get started</p>
            <Button
              onClick={() => navigate('/add-task')}
              className="btn-primary"
              data-testid="first-task-button"
            >
              Create First Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                data-testid={`task-card-${task.id}`}
                onClick={() => navigate(`/task/${task.id}`)}
                className="glass-card cursor-pointer group transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-heading text-xl text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                  {getStatusIcon(task.status)}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <span className="font-mono text-xs uppercase tracking-widest text-slate-500">
                    {task.task_type}
                  </span>
                  <span className="text-blue-400 font-medium">
                    ${task.estimated_cost || 10}
                  </span>
                </div>
                
                <div className="mt-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      task.urgency === 'high'
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : task.urgency === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}
                  >
                    {task.urgency} priority
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}