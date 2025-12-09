import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/utils/api';
import { ArrowLeft, User, Mail, Briefcase, Camera } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/profile', { params: { token } });
      setUser(response.data);
    } catch (error) {
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = () => {
    toast.info('Profile update feature - Coming soon!');
  };

  return (
    <div data-testid="profile-settings-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
      {/* Header */}
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            data-testid="back-button"
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-light text-2xl text-white">Profile Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-slate-400">Loading profile...</p>
          </div>
        ) : (
          <>
            {/* Profile Picture */}
            <div className="glass-card text-center mb-8">
              <div className="relative inline-block">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-2xl">
                  <span className="text-5xl font-bold text-white">{user?.full_name.charAt(0).toUpperCase()}</span>
                </div>
                <button className="absolute bottom-0 right-0 w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shadow-lg hover:bg-blue-600 transition-all">
                  <Camera className="w-6 h-6 text-white" />
                </button>
              </div>
              <h2 className="font-heading text-3xl text-white mt-6">{user?.full_name}</h2>
              <p className="text-slate-400 text-lg mt-2">{user?.email}</p>
              <span className="inline-block mt-3 px-4 py-2 text-sm font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                {user?.user_type === 'helper' ? 'Helper Account' : 'User Account'}
              </span>
            </div>

            {/* Profile Information */}
            <div className="glass-card">
              <h3 className="font-heading text-2xl text-white mb-6">Personal Information</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="full_name" className="text-slate-300 text-base">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="full_name"
                      defaultValue={user?.full_name}
                      className="bg-slate-950/50 border-white/10 text-white h-14 pl-12"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-slate-300 text-base">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      defaultValue={user?.email}
                      className="bg-slate-950/50 border-white/10 text-white h-14 pl-12"
                      disabled
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="user_type" className="text-slate-300 text-base">Account Type</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="user_type"
                      defaultValue={user?.user_type === 'helper' ? 'Helper' : 'User'}
                      className="bg-slate-950/50 border-white/10 text-white h-14 pl-12"
                      disabled
                    />
                  </div>
                </div>

                <Button onClick={handleUpdate} className="w-full btn-primary h-14">
                  Save Changes
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}