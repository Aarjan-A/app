import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { 
  Clock, CheckCircle, AlertCircle, Bell, Wallet, 
  Zap, Users, BarChart3, ShieldCheck, TrendingUp, Target
} from 'lucide-react';
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
    if (hour < 12) return 'Morning';
    if (hour < 18) return 'Afternoon';
    return 'Evening';
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

  const features = [
    {
      icon: Zap,
      title: 'Smart Automations',
      description: 'Set up recurring tasks and never miss a deadline',
      action: () => navigate('/automations'),
      color: 'blue'
    },
    {
      icon: Users,
      title: 'Helper Network',
      description: 'Connect with verified helpers for any task',
      action: () => navigate('/helpers'),
      color: 'purple'
    },
    {
      icon: BarChart3,
      title: 'Task Insights',
      description: 'Track your productivity and spending patterns',
      action: () => navigate('/insights'),
      color: 'green'
    },
    {
      icon: ShieldCheck,
      title: 'Secure Payments',
      description: 'Escrow protection for all transactions',
      action: () => navigate('/wallet'),
      color: 'indigo'
    },
    {
      icon: TrendingUp,
      title: 'Priority Tasks',
      description: 'AI-powered task prioritization and scheduling',
      action: () => navigate('/add-task'),
      color: 'orange'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Monitor your progress and achieve your goals',
      action: () => navigate('/insights'),
      color: 'pink'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: 'bg-blue-500/20 text-blue-400',
      purple: 'bg-purple-500/20 text-purple-400',
      green: 'bg-green-500/20 text-green-400',
      indigo: 'bg-indigo-500/20 text-indigo-400',
      orange: 'bg-orange-500/20 text-orange-400',
      pink: 'bg-pink-500/20 text-pink-400'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div data-testid="home-page" className="min-h-screen bg-[#0F1419] pb-24">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="text-3xl font-bold text-white" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' }}>
                  D
                </div>
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
              </div>
              <h1 className="font-heading font-light text-xl text-white">Doerly</h1>
            </div>
            
            {/* Action Icons */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/notifications')}
                data-testid="notifications-button"
                className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all relative"
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
                <Wallet className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/settings')}
                data-testid="settings-button"
                className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
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

        {/* Feature Cards */}
        <div className="mb-12">
          <h3 className="font-heading text-2xl text-white mb-6">What would you like to do?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, idx) => (
              <button
                key={idx}
                onClick={feature.action}
                className="glass-card text-left hover:scale-[1.02] transition-all cursor-pointer group"
              >
                <div className={`w-12 h-12 rounded-xl ${getColorClasses(feature.color)} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h4 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-400 text-sm">{feature.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-heading text-2xl text-white">Your Tasks</h3>
            <Button
              onClick={() => navigate('/add-task')}
              className="btn-primary"
              data-testid="add-task-button"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </Button>
          </div>

          {loading ? (
            <div className="text-center text-slate-400 py-12">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p>Loading your tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="glass-card text-center py-16">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <Target className="w-20 h-20 text-blue-400 opacity-50" />
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
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}