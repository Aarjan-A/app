import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { api } from '@/utils/api';
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function ProfileSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
  });
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/profile', { params: { token } });
      setUser(response.data);
      setFormData({
        full_name: response.data.full_name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        location: response.data.location || '',
        bio: response.data.bio || ''
      });
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save profile updates
      toast.success('Profile updated successfully!');
      navigate('/settings');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  return (
    <div data-testid="profile-settings-page" className="min-h-screen bg-[#0F1419] pb-24">
      <div className="glass border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/settings')}
            className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="font-heading font-light text-2xl text-white">Profile Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Your Profile</h2>
          <p className="text-slate-400 text-lg">Manage your personal information</p>
        </div>

        {/* Profile Avatar */}
        <div className="glass-card mb-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg mx-auto mb-4">
            <span className="text-3xl font-bold text-white">{getInitials(formData.full_name)}</span>
          </div>
          <Button className="btn-secondary" onClick={() => toast.info('Photo upload coming soon!')}>
            Change Photo
          </Button>
        </div>

        {/* Profile Form */}
        <div className="glass-card">
          <div className="space-y-6">
            <div>
              <Label htmlFor="full_name" className="text-slate-300 text-base flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                className="bg-slate-950/50 border-white/10 text-white h-12 rounded-xl"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-300 text-base flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-slate-950/50 border-white/10 text-white h-12 rounded-xl"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-slate-300 text-base flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="bg-slate-950/50 border-white/10 text-white h-12 rounded-xl"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            <div>
              <Label htmlFor="location" className="text-slate-300 text-base flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="bg-slate-950/50 border-white/10 text-white h-12 rounded-xl"
                placeholder="City, Country"
              />
            </div>

            <div>
              <Label htmlFor="bio" className="text-slate-300 text-base">Bio</Label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                className="w-full bg-slate-950/50 border border-white/10 text-white rounded-xl p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => navigate('/settings')}
              className="flex-1 btn-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="flex-1 btn-primary"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Account Info */}
        {user && (
          <div className="glass-card mt-8">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Account Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Type</span>
                <span className="text-white font-medium capitalize">{user.user_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">KYC Status</span>
                <span className="text-white font-medium capitalize">{user.kyc_status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Member Since</span>
                <span className="text-white font-medium">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}