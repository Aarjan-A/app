import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ArrowLeft, MapPin, Star, Briefcase, Users } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function HelperMarketplace() {
  const navigate = useNavigate();
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchHelpers();
  }, []);

  const fetchHelpers = async () => {
    try {
      const response = await api.get('/helpers', {
        params: { token },
      });
      setHelpers(response.data);
    } catch (error) {
      toast.error('Failed to load helpers');
    } finally {
      setLoading(false);
    }
  };

  const handleHireHelper = (helperId) => {
    toast.info('Helper hiring feature - Coming soon!');
  };

  return (
    <div data-testid="helper-marketplace-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Helpers</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Find a Helper</h2>
          <p className="text-slate-400 text-lg">Verified helpers ready to assist you</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading helpers...</p>
          </div>
        ) : helpers.length === 0 ? (
          <div className="glass-card text-center py-16">
            <Users className="w-20 h-20 text-blue-500 mx-auto mb-4 opacity-50" />
            <h3 className="font-heading text-2xl text-white mb-2">No helpers available</h3>
            <p className="text-slate-400 mb-6">Be the first to join as a helper!</p>
            <Button onClick={() => toast.info('Helper registration - Coming soon!')} className="btn-primary">
              Become a Helper
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpers.map((helper) => (
              <div
                key={helper.id}
                data-testid={`helper-card-${helper.id}`}
                className="glass-card hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {helper.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-white">{helper.full_name}</h3>
                    <p className="text-slate-400 text-sm">{helper.email}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <Star className="w-4 h-4 text-yellow-400" />
                    </div>
                    <span className="text-slate-300 text-sm">4.8 rating (127 reviews)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-slate-300 text-sm">Available nearby</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Briefcase className="w-4 h-4 text-green-400" />
                    </div>
                    <span className="text-slate-300 text-sm capitalize">{helper.kyc_status}</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleHireHelper(helper.id)}
                  className="w-full btn-primary"
                  data-testid={`hire-helper-${helper.id}`}
                >
                  Hire Helper
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}