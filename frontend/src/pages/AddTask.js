import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/utils/api';
import { ArrowLeft, Camera, FileText, Upload, Video, X } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function AddTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    task_type: 'ai',
    urgency: 'medium',
    estimated_cost: ''
  });
  const token = localStorage.getItem('doerly_token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/tasks', {
        ...taskData,
        estimated_cost: parseFloat(taskData.estimated_cost || 10)
      }, {
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

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB');
      return;
    }

    const fileObj = {
      id: Date.now(),
      name: file.name,
      type: type,
      size: (file.size / 1024).toFixed(2) + ' KB',
      file: file
    };

    setUploadedFiles(prev => [...prev, fileObj]);
    toast.success(`${type} uploaded successfully`);
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== id));
    toast.info('File removed');
  };

  return (
    <div data-testid="add-task-page" className="min-h-screen bg-[#0F1419] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Add Task</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* File Upload Options */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <label
            htmlFor="photo-upload"
            className="glass-card cursor-pointer text-center py-8 hover:scale-105 transition-all group"
            data-testid="photo-capture-button"
          >
            <Camera className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-slate-300 font-medium">Photo</span>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'photo')}
            />
          </label>

          <label
            htmlFor="video-upload"
            className="glass-card cursor-pointer text-center py-8 hover:scale-105 transition-all group"
            data-testid="video-capture-button"
          >
            <Video className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-slate-300 font-medium">Video</span>
            <input
              id="video-upload"
              type="file"
              accept="video/*"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'video')}
            />
          </label>

          <label
            htmlFor="document-upload"
            className="glass-card cursor-pointer text-center py-8 hover:scale-105 transition-all group"
            data-testid="document-capture-button"
          >
            <FileText className="w-8 h-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-slate-300 font-medium">Document</span>
            <input
              id="document-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
              className="hidden"
              onChange={(e) => handleFileUpload(e, 'document')}
            />
          </label>
        </div>

        {/* Uploaded Files Display */}
        {uploadedFiles.length > 0 && (
          <div className="glass-card mb-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" />
              Uploaded Files ({uploadedFiles.length})
            </h3>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      file.type === 'photo' ? 'bg-blue-500/20' :
                      file.type === 'video' ? 'bg-purple-500/20' :
                      'bg-green-500/20'
                    }`}>
                      {file.type === 'photo' ? <Camera className="w-5 h-5 text-blue-400" /> :
                       file.type === 'video' ? <Video className="w-5 h-5 text-purple-400" /> :
                       <FileText className="w-5 h-5 text-green-400" />}
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-slate-500 text-xs">{file.size}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Task Form */}
        <div className="glass-card">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-slate-300 text-base">Task Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Pay electricity bill"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                required
                data-testid="task-title-input"
                className="bg-slate-950/50 border-white/10 text-white h-12 text-lg placeholder:text-slate-500 rounded-xl"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-slate-300 text-base">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide details about the task..."
                value={taskData.description}
                onChange={(e) => setTaskData({...taskData, description: e.target.value})}
                required
                data-testid="task-description-input"
                className="bg-slate-950/50 border-white/10 text-white min-h-[150px] text-base placeholder:text-slate-500 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task_type" className="text-slate-300 text-base">Task Type</Label>
                <select
                  id="task_type"
                  name="task_type"
                  value={taskData.task_type}
                  onChange={(e) => setTaskData({...taskData, task_type: e.target.value})}
                  required
                  data-testid="task-type-select"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl h-12 px-4 text-white appearance-none cursor-pointer hover:border-blue-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="ai" className="bg-slate-900">AI Automation</option>
                  <option value="helper" className="bg-slate-900">Human Helper</option>
                </select>
              </div>

              <div>
                <Label htmlFor="urgency" className="text-slate-300 text-base">Urgency</Label>
                <select
                  id="urgency"
                  name="urgency"
                  value={taskData.urgency}
                  onChange={(e) => setTaskData({...taskData, urgency: e.target.value})}
                  required
                  data-testid="task-urgency-select"
                  className="w-full bg-slate-950/50 border border-white/10 rounded-xl h-12 px-4 text-white appearance-none cursor-pointer hover:border-blue-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                >
                  <option value="low" className="bg-slate-900">Low</option>
                  <option value="medium" className="bg-slate-900">Medium</option>
                  <option value="high" className="bg-slate-900">High</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="estimated_cost" className="text-slate-300 text-base">Estimated Cost ($)</Label>
              <Input
                id="estimated_cost"
                name="estimated_cost"
                type="number"
                step="0.01"
                placeholder="10.00"
                value={taskData.estimated_cost}
                onChange={(e) => setTaskData({...taskData, estimated_cost: e.target.value})}
                data-testid="task-cost-input"
                className="bg-slate-950/50 border-white/10 text-white h-12 text-lg placeholder:text-slate-500 rounded-xl"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-primary h-12 text-lg"
              disabled={loading}
              data-testid="create-task-button"
            >
              {loading ? 'Creating...' : 'Create Task'}
            </Button>
          </form>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}