import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { api } from '@/utils/api';
import { ArrowLeft, Zap, Plus, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export default function Automations() {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
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
      toast.success('Automation updated');
    } catch (error) {
      toast.error('Failed to update automation');
    }
  };

  const automationTypes = [
    { type: 'auto_bill_pay', name: 'Auto Bill Pay', icon: '💵' },
    { type: 'subscription_renewal', name: 'Subscription Renewal', icon: '🔄' },
    { type: 'sim_topup', name: 'SIM Top-up', icon: '📱' },
    { type: 'grocery_restock', name: 'Grocery Restock', icon: '🛒' },
    { type: 'medicine_refill', name: 'Medicine Refill', icon: '💊' },
    { type: 'govt_renewals', name: 'Govt Renewals', icon: '📄' },
  ];

  return (
    <div data-testid="automations-page" className="min-h-screen bg-[#020617]">
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
          <h1 className="font-heading font-light text-2xl text-white">Automations</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Task Automations</h2>
          <p className="text-slate-400 text-lg">Set it and forget it</p>
        </div>

        {/* Available Automations */}
        <div className="glass-card mb-8">
          <h3 className="font-heading text-2xl text-white mb-6">Available Automations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {automationTypes.map((auto) => (
              <div
                key={auto.type}
                data-testid={`automation-type-${auto.type}`}
                className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-3xl">{auto.icon}</span>
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-white font-medium">{auto.name}</h4>
              </div>
            ))}
          </div>
        </div>

        {/* Active Automations */}
        <div className="glass-card">
          <h3 className="font-heading text-2xl text-white mb-6">Your Automations</h3>
          
          {automations.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
              <p className="text-slate-400 mb-4">No automations set up yet</p>
              <Button className="btn-primary" data-testid="create-automation-button">
                <Plus className="w-5 h-5 mr-2" />
                Create Automation
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {automations.map((automation) => (
                <div
                  key={automation.id}
                  data-testid={`automation-${automation.id}`}
                  className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-white/5"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{automation.automation_type}</p>
                      <p className="text-slate-400 text-sm">{automation.schedule}</p>
                    </div>
                  </div>
                  <Switch
                    checked={automation.active}
                    onCheckedChange={() =>
                      toggleAutomation(automation.id, automation.active)
                    }
                    data-testid={`toggle-automation-${automation.id}`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
