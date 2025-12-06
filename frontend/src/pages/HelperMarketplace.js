import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { api } from '@/utils/api';
import { ArrowLeft, MapPin, Star, Briefcase } from 'lucide-react';
import { toast } from 'sonner';

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

  return (
    <div data-testid="helper-marketplace-page" className="min-h-screen bg-[#020617]">
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
          <h1 className="font-heading font-light text-2xl text-white">Helper Marketplace</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Find a Helper</h2>
          <p className="text-slate-400 text-lg">Verified helpers ready to assist you</p>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <p>Loading helpers...</p>
          </div>
        ) : helpers.length === 0 ? (
          <div className="glass-card text-center py-12">
            <Briefcase className="w-16 h-16 text-blue-500 mx-auto mb-4 opacity-50" />
            <h3 className="font-heading text-2xl text-white mb-2">No helpers available</h3>
            <p className="text-slate-400">Check back later for available helpers</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpers.map((helper) => (
              <div
                key={helper.id}
                data-testid={`helper-card-${helper.id}`}
                className="glass-card hover:scale-105 transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <span className="text-white text-xl font-semibold">
                      {helper.full_name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-white">{helper.full_name}</h3>
                    <p className="text-slate-400 text-sm">{helper.email}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>4.8 rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    <span>Nearby</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 text-sm">
                    <Briefcase className="w-4 h-4 text-green-400" />
                    <span>{helper.kyc_status}</span>
                  </div>
                </div>

                <Button
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
    </div>
  );
}
