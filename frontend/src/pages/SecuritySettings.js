import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Lock, Shield, Smartphone, Key, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function SecuritySettings() {
  const navigate = useNavigate();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);

  const handlePasswordChange = () => {
    toast.info('Password change feature - Coming soon!');
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    toast.success(`Two-factor authentication ${!twoFactorEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleBiometricsToggle = () => {
    setBiometricsEnabled(!biometricsEnabled);
    toast.success(`Biometric login ${!biometricsEnabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div data-testid="security-settings-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Security</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Security Settings</h2>
          <p className="text-slate-400 text-lg">Keep your account secure</p>
        </div>

        {/* Password Section */}
        <div className="glass-card mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl text-white mb-2">Change Password</h3>
              <p className="text-slate-400 mb-4">Update your password regularly to keep your account secure</p>
              <Button onClick={handlePasswordChange} className="btn-primary">
                Change Password
              </Button>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div className="glass-card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="font-heading text-xl text-white mb-2">Two-Factor Authentication</h3>
                <p className="text-slate-400">Add an extra layer of security to your account</p>
              </div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={handleTwoFactorToggle} />
          </div>
        </div>

        {/* Biometric Login */}
        <div className="glass-card mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="font-heading text-xl text-white mb-2">Biometric Login</h3>
                <p className="text-slate-400">Use fingerprint or face recognition to login</p>
              </div>
            </div>
            <Switch checked={biometricsEnabled} onCheckedChange={handleBiometricsToggle} />
          </div>
        </div>

        {/* Active Sessions */}
        <div className="glass-card mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <Key className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-xl text-white mb-2">Active Sessions</h3>
              <p className="text-slate-400 mb-4">Manage devices where you're logged in</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-slate-950/50 rounded-xl p-4 border border-white/5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Current Device</p>
                  <p className="text-slate-400 text-sm">Chrome on Windows • Active now</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">Active</span>
              </div>
            </div>
          </div>
        </div>

        {/* Security Alert */}
        <div className="glass-card border-yellow-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-heading text-xl text-white mb-2">Security Tips</h3>
              <ul className="text-slate-300 space-y-2">
                <li>• Use a strong, unique password</li>
                <li>• Enable two-factor authentication</li>
                <li>• Never share your password with anyone</li>
                <li>• Review active sessions regularly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}