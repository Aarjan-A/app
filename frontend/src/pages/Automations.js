import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/utils/api';
import { ArrowLeft, Zap, Plus } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function Automations() {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [schedule, setSchedule] = useState('daily');
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const response = await api.get('/automations', {
        params: { token },
      });
      setAutomations(response.data);
    } catch (error) {
      toast.error('Failed to load automations');
    } finally {
      setLoading(false);
    }
  };

  const toggleAutomation = async (autoId, currentStatus) => {
    try {
      await api.patch(`/automations/${autoId}/toggle`, {}, {
        params: { token },
      });
      setAutomations(
        automations.map((auto) =>
          auto.id === autoId ? { ...auto, active: !currentStatus } : auto
        )
      );
      toast.success(`Automation ${!currentStatus ? 'enabled' : 'disabled'}`);
    } catch (error) {
      toast.error('Failed to update automation');
    }
  };

  const handleCreateAutomation = (type) => {
    setSelectedType(type);
    setShowCreateDialog(true);
  };

  const handleSubmitAutomation = async () => {
    if (!selectedType || !schedule) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await api.post(
        '/automations',
        {},
        {
          params: { 
            token,
            automation_type: selectedType.type,
            schedule: schedule
          },
        }
      );
      
      setAutomations([...automations, response.data]);
      toast.success(`${selectedType.name} automation created!`);
      setShowCreateDialog(false);
      setSelectedType(null);
      setSchedule('daily');
    } catch (error) {
      toast.error('Failed to create automation');
    }
  };

  const deleteAutomation = async (autoId) => {
    try {
      await api.delete(`/automations/${autoId}`, {
        params: { token },
      });
      setAutomations(automations.filter((auto) => auto.id !== autoId));
      toast.success('Automation deleted');
    } catch (error) {
      toast.error('Failed to delete automation');
    }
  };

  const automationTypes = [
    { type: 'auto_bill_pay', name: 'Auto Bill Pay', icon: '💵', description: 'Automatically pay recurring bills' },
    { type: 'subscription_renewal', name: 'Subscription Renewal', icon: '🔄', description: 'Never miss a subscription renewal' },
    { type: 'sim_topup', name: 'SIM Top-up', icon: '📱', description: 'Auto-recharge mobile balance' },
    { type: 'grocery_restock', name: 'Grocery Restock', icon: '🛍', description: 'Schedule recurring grocery orders' },
    { type: 'medicine_refill', name: 'Medicine Refill', icon: '💊', description: 'Automatic medicine refills' },
    { type: 'govt_renewals', name: 'Govt Renewals', icon: '📄', description: 'Track government document renewals' },
  ];

  return (
    <div data-testid="automations-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Automations</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Task Automations</h2>
          <p className="text-slate-400 text-lg">Set it and forget it</p>
        </div>

        {/* Available Automations */}
        <div className="glass-card mb-8">
          <h3 className="font-heading text-2xl text-white mb-6">Available Automations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationTypes.map((auto) => (
              <button
                key={auto.type}
                onClick={() => handleCreateAutomation(auto.type)}
                data-testid={`automation-type-${auto.type}`}
                className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 hover:bg-slate-900/50 transition-all cursor-pointer text-left group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-4xl">{auto.icon}</span>
                  <Zap className="w-5 h-5 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="text-white font-medium text-lg mb-1">{auto.name}</h4>
                <p className="text-slate-400 text-sm">{auto.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Active Automations */}
        <div className="glass-card">
          <h3 className="font-heading text-2xl text-white mb-6">Your Automations</h3>
          
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Loading automations...</p>
            </div>
          ) : automations.length === 0 ? (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 mb-4">No automations set up yet</p>
              <p className="text-slate-500 text-sm mb-6">Create your first automation above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  data-testid={`automation-${automation.id}`}
                  className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5 hover:border-white/10 transition-all"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium capitalize">{automation.automation_type.replace(/_/g, ' ')}</p>
                      <p className="text-slate-400 text-sm capitalize">{automation.schedule}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={automation.active}
                      onCheckedChange={() =>
                        toggleAutomation(automation.id, automation.active)
                      }
                      data-testid={`toggle-automation-${automation.id}`}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAutomation(automation.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Automation Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-900 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">
              {selectedType ? `Create ${selectedType.name}` : 'Create Automation'}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Set up your automation schedule
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {selectedType && (
              <div className="glass-card border-blue-500/30">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{selectedType.icon}</span>
                  <h4 className="text-white font-medium">{selectedType.name}</h4>
                </div>
                <p className="text-slate-400 text-sm">{selectedType.description}</p>
              </div>
            )}
            
            <div>
              <Label htmlFor="schedule" className="text-slate-300 text-base">Schedule</Label>
              <select
                id="schedule"
                value={schedule}
                onChange={(e) => setSchedule(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/10 rounded-2xl h-14 px-4 text-white appearance-none cursor-pointer hover:border-blue-500/50 transition-all"
              >
                <option value="daily" className="bg-slate-900">Daily</option>
                <option value="weekly" className="bg-slate-900">Weekly</option>
                <option value="monthly" className="bg-slate-900">Monthly</option>
                <option value="on_due_date" className="bg-slate-900">On Due Date</option>
              </select>
            </div>

            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  setShowCreateDialog(false);
                  setSelectedType(null);
                }}
                className="flex-1 btn-secondary"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSubmitAutomation}
                className="flex-1 btn-primary"
              >
                Create Automation
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}