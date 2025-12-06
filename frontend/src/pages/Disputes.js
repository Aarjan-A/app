import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ArrowLeft, AlertTriangle, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

export default function Disputes() {
  const navigate = useNavigate();
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const response = await api.get('/disputes', {
        params: { token },
      });
      setDisputes(response.data);
    } catch (error) {
      toast.error('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="disputes-page" className="min-h-screen bg-[#020617]">
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
          <h1 className="font-heading font-light text-2xl text-white">Disputes</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass-card">
          {disputes.length === 0 ? (
            <div className="text-center py-12">
              <AlertTriangle className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
              <h3 className="font-heading text-2xl text-white mb-2">No disputes</h3>
              <p className="text-slate-400">All transactions are going smoothly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {disputes.map((dispute) => (
                <div
                  key={dispute.id}
                  data-testid={`dispute-${dispute.id}`}
                  className="p-6 bg-slate-950/50 rounded-2xl border border-white/5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Dispute #{dispute.id.slice(0, 8)}</p>
                        <p className="text-slate-400 text-sm">{dispute.status}</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4">{dispute.reason}</p>
                  <Button
                    className="btn-secondary"
                    data-testid={`view-dispute-${dispute.id}`}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
