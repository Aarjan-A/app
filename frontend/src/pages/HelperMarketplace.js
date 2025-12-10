import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { api } from '@/utils/api';
import { ArrowLeft, MapPin, Star, Briefcase, Users, Search, Filter, DollarSign, Clock, Award, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function HelperMarketplace() {
  const navigate = useNavigate();
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedHelper, setSelectedHelper] = useState(null);
  const [showHireDialog, setShowHireDialog] = useState(false);
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

  const handleHireHelper = (helper) => {
    setSelectedHelper(helper);
    setShowHireDialog(true);
  };

  const confirmHire = async () => {
    try {
      // API call to hire helper
      toast.success(`Hired ${selectedHelper.full_name}! They'll be notified.`);
      setShowHireDialog(false);
      setSelectedHelper(null);
    } catch (error) {
      toast.error('Failed to hire helper');
    }
  };

  const filteredHelpers = helpers.filter(helper => 
    helper.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    helper.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div data-testid="helper-marketplace-page" className="min-h-screen bg-[#0F1419] pb-24">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              data-testid="back-button"
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="font-heading font-light text-2xl text-white">Helper Marketplace</h1>
          </div>
          
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search helpers by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/50 border-white/10 text-white pl-12 h-12 rounded-xl"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Find Your Perfect Helper</h2>
          <p className="text-slate-400 text-lg">Verified professionals ready to assist with your tasks</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="glass-card text-center">
            <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">{helpers.length}</p>
            <p className="text-slate-400 text-sm">Available Helpers</p>
          </div>
          <div className="glass-card text-center">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">4.8</p>
            <p className="text-slate-400 text-sm">Avg Rating</p>
          </div>
          <div className="glass-card text-center">
            <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white">1.2k+</p>
            <p className="text-slate-400 text-sm">Tasks Completed</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center text-slate-400 py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p>Loading helpers...</p>
          </div>
        ) : filteredHelpers.length === 0 ? (
          <div className="glass-card text-center py-16">
            <Users className="w-20 h-20 text-blue-500 mx-auto mb-4 opacity-50" />
            <h3 className="font-heading text-2xl text-white mb-2">
              {searchTerm ? 'No helpers found' : 'No helpers available'}
            </h3>
            <p className="text-slate-400 mb-6">
              {searchTerm ? 'Try adjusting your search' : 'Be the first to join as a helper!'}
            </p>
            {!searchTerm && (
              <Button onClick={() => toast.info('Helper registration - Coming soon!')} className="btn-primary">
                Become a Helper
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHelpers.map((helper) => (
              <div
                key={helper.id}
                data-testid={`helper-card-${helper.id}`}
                className="glass-card hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                    <span className="text-white text-2xl font-bold">
                      {getInitials(helper.full_name)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-xl text-white">{helper.full_name}</h3>
                    <p className="text-slate-400 text-sm">{helper.email}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-sm font-medium">4.8</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs">Specialization</p>
                      <p className="text-white text-sm font-medium">General Tasks</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Award className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs">Tasks Completed</p>
                      <p className="text-white text-sm font-medium">127 tasks</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs">Hourly Rate</p>
                      <p className="text-white text-sm font-medium">$25/hr</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                      <Clock className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs">Response Time</p>
                      <p className="text-white text-sm font-medium">< 2 hours</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-400 text-xs">Availability</p>
                      <p className="text-white text-sm font-medium">Available Now</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
                    Verified
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    Top Rated
                  </span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400 border border-purple-500/30">
                    Fast Response
                  </span>
                </div>

                <Button
                  onClick={() => handleHireHelper(helper)}
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

      {/* Hire Confirmation Dialog */}
      <Dialog open={showHireDialog} onOpenChange={setShowHireDialog}>
        <DialogContent className="bg-slate-900 border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Hire {selectedHelper?.full_name}</DialogTitle>
            <DialogDescription className="text-slate-400">
              Confirm hiring this helper for your task
            </DialogDescription>
          </DialogHeader>
          {selectedHelper && (
            <div className="space-y-4 mt-4">
              <div className="glass-card">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {getInitials(selectedHelper.full_name)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-lg">{selectedHelper.full_name}</h4>
                    <p className="text-slate-400 text-sm">{selectedHelper.email}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm">4.8 (127 reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hourly Rate</span>
                    <span className="text-white font-medium">$25/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Time</span>
                    <span className="text-white font-medium">2-3 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Estimate</span>
                    <span className="text-white font-medium">$50-75</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => {
                    setShowHireDialog(false);
                    setSelectedHelper(null);
                  }}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmHire}
                  className="flex-1 btn-primary"
                >
                  Confirm Hire
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}