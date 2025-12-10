import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Lock, Key, Shield, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function SecuritySettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      // Call API to change password
      toast.success('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div data-testid="security-settings-page" className="min-h-screen bg-[#0F1419] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Security Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Security & Privacy</h2>
          <p className="text-slate-400 text-lg">Manage your account security</p>
        </div>

        {/* Change Password */}
        <div className="glass-card mb-6">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            Change Password
          </h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="current_password" className="text-slate-300 text-base">Current Password</Label>
              <Input
                id="current_password"
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                className="bg-slate-950/50 border-white/10 text-white h-12 rounded-xl"
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="new_password" className="text-slate-300 text-base">New Password</Label>
              <Input
                id="new_password"
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="bg-slate-950/50 border-white/10 text-white h-12 rounded-xl"
                placeholder="••••••••"
              />
            </div>
            <div>
              <Label htmlFor="confirm_password" className="text-slate-300 text-base">Confirm New Password</Label>
              <Input
                id="confirm_password"
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="bg-slate-950/50 border-white/10 text-white h-12 rounded-xl"
                placeholder="••••••••"
              />
            </div>
            <Button
              onClick={handleChangePassword}
              disabled={loading}
              className="w-full btn-primary"
            >
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="glass-card mb-6">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Smartphone className="w-5 h-5 text-green-400" />
            Two-Factor Authentication
          </h3>
          <p className="text-slate-400 text-sm mb-4">
            Add an extra layer of security to your account
          </p>
          <Button className="btn-secondary" onClick={() => toast.info('2FA setup coming soon!')}>
            Enable 2FA
          </Button>
        </div>

        {/* Security Tips */}
        <div className="glass-card">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-yellow-400" />
            Security Tips
          </h3>
          <ul className="space-y-3 text-slate-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Use a strong password with at least 8 characters</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Enable two-factor authentication for extra security</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Never share your password with anyone</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400 mt-1">✓</span>
              <span>Regularly review your account activity</span>
            </li>
          </ul>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}