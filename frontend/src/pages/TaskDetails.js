import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ArrowLeft, Zap, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';
import { toast } from 'sonner';

export default function TaskDetails() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      const response = await api.get(`/tasks/${taskId}`, {
        params: { token },
      });
      setTask(response.data);
    } catch (error) {
      toast.error('Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus) => {
    try {
      await api.patch(
        `/tasks/${taskId}/status`,
        { status: newStatus },
        { params: { token, status: newStatus } }
      );
      toast.success('Status updated');
      fetchTask();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <p className="text-slate-400">Loading task...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center">
        <p className="text-slate-400">Task not found</p>
      </div>
    );
  }

  return (
    <div data-testid="task-details-page" className="min-h-screen bg-[#020617]">
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
          <h1 className="font-heading font-light text-2xl text-white">Task Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass-card">
          {/* Task Header */}
          <div className="mb-8">
            <h2 className="font-heading text-4xl text-white mb-4">{task.title}</h2>
            <p className="text-slate-400 text-lg leading-relaxed">{task.description}</p>
          </div>

          {/* Task Meta */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">
                Type
              </p>
              <p className="text-white font-medium">{task.task_type}</p>
            </div>

            <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">
                Status
              </p>
              <p className="text-white font-medium capitalize">{task.status}</p>
            </div>

            <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">
                Urgency
              </p>
              <p className="text-white font-medium capitalize">{task.urgency}</p>
            </div>

            <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500 mb-1">
                Cost
              </p>
              <p className="text-blue-400 font-medium">${task.estimated_cost}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4 flex-wrap">
            {task.status === 'pending' && (
              <Button
                onClick={() => updateStatus('in_progress')}
                className="btn-primary"
                data-testid="start-task-button"
              >
                <Zap className="w-5 h-5 mr-2" />
                Start Task
              </Button>
            )}

            {task.status === 'in_progress' && (
              <Button
                onClick={() => updateStatus('completed')}
                className="btn-primary"
                data-testid="complete-task-button"
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                Mark Complete
              </Button>
            )}

            {task.task_type === 'helper' && task.status === 'pending' && (
              <Button
                onClick={() => navigate('/helpers')}
                className="btn-secondary"
                data-testid="find-helper-button"
              >
                <User className="w-5 h-5 mr-2" />
                Find Helper
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
