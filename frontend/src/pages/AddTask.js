import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/utils/api';
import { ArrowLeft, Camera, Mic, FileText, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function AddTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const token = localStorage.getItem('doerly_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const taskData = {
      title: formData.get('title'),
      description: formData.get('description'),
      task_type: formData.get('task_type'),
      urgency: formData.get('urgency'),
      estimated_cost: parseFloat(formData.get('estimated_cost') || 10),
    };

    try {
      await api.post('/tasks', taskData, {
        params: { token },
      });
      toast.success('Task created successfully!');
      navigate('/');
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAiLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);

    try {
      const response = await api.post('/ai/analyze-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Image analyzed! Check the suggestion.');
      console.log('AI Analysis:', response.data.analysis);
    } catch (error) {
      toast.error('Failed to analyze image');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div data-testid="add-task-page" className="min-h-screen bg-[#020617]">
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
          <h1 className="font-heading font-light text-2xl text-white">Add Task</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Quick Capture Options */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <label
            htmlFor="image-upload"
            className="glass-card cursor-pointer text-center py-6 hover:scale-105 transition-all"
            data-testid="photo-capture-button"
          >
            <Camera className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300">Photo</span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <div
            className="glass-card cursor-pointer text-center py-6 hover:scale-105 transition-all"
            data-testid="voice-capture-button"
          >
            <Mic className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300">Voice</span>
          </div>

          <div
            className="glass-card cursor-pointer text-center py-6 hover:scale-105 transition-all"
            data-testid="document-capture-button"
          >
            <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <span className="text-sm text-slate-300">Document</span>
          </div>
        </div>

        {aiLoading && (
          <div className="glass-card mb-8 p-6 text-center">
            <Sparkles className="w-8 h-8 text-blue-400 mx-auto mb-2 animate-pulse" />
            <p className="text-slate-300">AI is analyzing your input...</p>
          </div>
        )}

        {/* Task Form */}
        <div className="glass-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-slate-300">Task Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Pay electricity bill"
                required
                data-testid="task-title-input"
                className="bg-slate-950/50 border-white/10 text-white h-12"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-300">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide details about the task..."
                required
                data-testid="task-description-input"
                className="bg-slate-950/50 border-white/10 text-white min-h-[120px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task_type" className="text-slate-300">Task Type</Label>
                <select
                  id="task_type"
                  name="task_type"
                  required
                  data-testid="task-type-select"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl h-12 px-4 text-white"
                >
                  <option value="ai">AI Automation</option>
                  <option value="helper">Human Helper</option>
                </select>
              </div>

              <div>
                <Label htmlFor="urgency" className="text-slate-300">Urgency</Label>
                <select
                  id="urgency"
                  name="urgency"
                  required
                  data-testid="task-urgency-select"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl h-12 px-4 text-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="estimated_cost" className="text-slate-300">Estimated Cost ($)</Label>
              <Input
                id="estimated_cost"
                name="estimated_cost"
                type="number"
                step="0.01"
                placeholder="10.00"
                data-testid="task-cost-input"
                className="bg-slate-950/50 border-white/10 text-white h-12"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-primary"
              disabled={loading}
              data-testid="create-task-button"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
