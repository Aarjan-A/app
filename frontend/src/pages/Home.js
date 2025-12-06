import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { Plus, Zap, Clock, CheckCircle, AlertCircle, Menu, Bell, Settings as SettingsIcon, Wallet as WalletIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks', {
        params: { token },
      });
      setTasks(response.data);
    } catch (error) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'in_progress':
        return <Zap className="w-5 h-5 text-blue-400" />;
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div data-testid="home-page" className="min-h-screen bg-[#020617]">
      {/* Header */}
      <div className="glass border-b border-white/5 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-heading font-light text-2xl text-white">Doerly</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/notifications')}
              data-testid="notifications-button"
              className="text-slate-400 hover:text-white"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/wallet')}
              data-testid="wallet-button"
              className="text-slate-400 hover:text-white"
            >
              <WalletIcon className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/settings')}
              data-testid="settings-button"
              className="text-slate-400 hover:text-white"
            >
              <SettingsIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h2 className="font-heading font-light text-5xl md:text-6xl tracking-tight text-white mb-4">
            Your Action Inbox
          </h2>
          <p className="font-body text-lg text-slate-400 mb-8">
            AI-powered tasks and human helpers, all in one place
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={() => navigate('/add-task')}
              className="btn-primary"
              data-testid="add-task-button"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
            <Button
              onClick={() => navigate('/automations')}
              className="btn-secondary"
              data-testid="automations-button"
            >
              <Zap className="w-5 h-5 mr-2" />
              Automations
            </Button>
            <Button
              onClick={() => navigate('/helpers')}
              className="btn-secondary"
              data-testid="helpers-button"
            >
              Helpers
            </Button>
          </div>
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="glass-card text-center py-12">
            <Zap className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
            <h3 className="font-heading text-2xl text-white mb-2">No tasks yet</h3>
            <p className="text-slate-400 mb-6">Add your first task to get started</p>
            <Button
              onClick={() => navigate('/add-task')}
              className="btn-primary"
              data-testid="first-task-button"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Task
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                data-testid={`task-card-${task.id}`}
                onClick={() => navigate(`/task/${task.id}`)}
                className="glass-card cursor-pointer group transition-all duration-300 hover:scale-105"
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
                
                <div className="mt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      task.urgency === 'high'
                        ? 'bg-red-500/20 text-red-400'
                        : task.urgency === 'medium'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-green-500/20 text-green-400'
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
  );
}
