import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/utils/api';
import { ArrowLeft, Camera, Mic, FileText, Sparkles, Upload } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function AddTask() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    task_type: 'ai',
    urgency: 'medium',
    estimated_cost: ''
  });
  const recognitionRef = useRef(null);
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

  const handleDocumentUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAiLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('token', token);

    try {
      const response = await api.post('/ai/analyze-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      toast.success('Document analyzed!');
      if (response.data.extracted_text) {
        setTaskData(prev => ({
          ...prev,
          description: prev.description + '\n' + response.data.extracted_text
        }));
      }
    } catch (error) {
      toast.error('Failed to analyze document');
    } finally {
      setAiLoading(false);
    }
  };

  const startVoiceRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast.error('Voice recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
      toast.info('Listening... Speak now!');
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setTaskData(prev => ({
          ...prev,
          description: prev.description + finalTranscript
        }));
      }
    };

    recognition.onerror = (event) => {
      toast.error('Voice recognition error: ' + event.error);
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const handleVoiceClick = () => {
    if (isRecording) {
      stopVoiceRecording();
    } else {
      startVoiceRecording();
    }
  };

  return (
    <div data-testid="add-task-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
        {/* Quick Capture Options */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <label
            htmlFor="image-upload"
            className="glass-card cursor-pointer text-center py-8 hover:scale-105 transition-all group"
            data-testid="photo-capture-button"
          >
            <Camera className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-slate-300 font-medium">Photo</span>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>

          <button
            onClick={handleVoiceClick}
            className={`glass-card text-center py-8 hover:scale-105 transition-all group ${
              isRecording ? 'border-red-500/50 bg-red-500/10' : ''
            }`}
            data-testid="voice-capture-button"
          >
            <Mic className={`w-8 h-8 mx-auto mb-2 group-hover:scale-110 transition-transform ${
              isRecording ? 'text-red-400 animate-pulse' : 'text-blue-400'
            }`} />
            <span className={`text-sm font-medium ${
              isRecording ? 'text-red-400' : 'text-slate-300'
            }`}>
              {isRecording ? 'Recording...' : 'Voice'}
            </span>
          </button>

          <label
            htmlFor="document-upload"
            className="glass-card cursor-pointer text-center py-8 hover:scale-105 transition-all group"
            data-testid="document-capture-button"
          >
            <FileText className="w-8 h-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-slate-300 font-medium">Document</span>
            <input
              id="document-upload"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
              onChange={handleDocumentUpload}
            />
          </label>
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
              <Label htmlFor="title" className="text-slate-300 text-base">Task Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Pay electricity bill"
                value={taskData.title}
                onChange={(e) => setTaskData({...taskData, title: e.target.value})}
                required
                data-testid="task-title-input"
                className="bg-slate-950/50 border-white/10 text-white h-14 text-lg placeholder:text-slate-500"
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
                className="bg-slate-950/50 border-white/10 text-white min-h-[150px] text-base placeholder:text-slate-500"
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
                  className="w-full bg-slate-950/30 backdrop-blur-xl border border-white/20 rounded-2xl h-14 px-4 text-white appearance-none cursor-pointer hover:border-blue-500/50 transition-all"
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
                  className="w-full bg-slate-950/30 backdrop-blur-xl border border-white/20 rounded-2xl h-14 px-4 text-white appearance-none cursor-pointer hover:border-blue-500/50 transition-all"
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
                className="bg-slate-950/50 border-white/10 text-white h-14 text-lg placeholder:text-slate-500"
              />
            </div>

            <Button
              type="submit"
              className="w-full btn-primary h-14 text-lg"
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