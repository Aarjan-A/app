import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { clearAuthToken, api } from '@/utils/api';
import { 
  ArrowLeft, User, Shield, CreditCard, Bell, HelpCircle, LogOut, 
  Moon, Sun, BarChart3, FileText, Trash2, Eye, Lock, Mail, 
  Globe, Smartphone, Database, Info
} from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function Settings() {
  const navigate = useNavigate();
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('doerly_token');

  useEffect(() => {
    fetchUser();
    document.body.classList.toggle('light-mode', theme === 'light');
  }, [theme]);

  const fetchUser = async () => {
    try {
      const response = await api.get('/users/profile', { params: { token } });
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user');
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.body.classList.toggle('light-mode', newTheme === 'light');
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleLogout = () => {
    clearAuthToken();
    toast.success('Logged out successfully');
    navigate('/auth');
    window.location.reload();
  };

  const handleDeleteAccount = async () => {
    try {
      await api.delete('/users/account', { params: { token } });
      clearAuthToken();
      toast.success('Account deleted successfully');
      navigate('/auth');
      window.location.reload();
    } catch (error) {
      toast.error('Failed to delete account');
    }
  };

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Profile Settings', description: 'Manage your personal information', action: () => toast.info('Profile settings - Coming soon!') },
        { icon: Mail, label: 'Email Preferences', description: 'Manage email notifications', action: () => toast.info('Email preferences - Coming soon!') },
        { icon: Shield, label: 'Security', description: 'Password and authentication', action: () => toast.info('Security settings - Coming soon!') },
        { icon: Lock, label: 'Privacy', description: 'Control your data and privacy', action: () => toast.info('Privacy settings - Coming soon!') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { 
          icon: theme === 'dark' ? Moon : Sun, 
          label: 'Theme', 
          description: `Currently ${theme} mode`,
          isSwitch: true,
          checked: theme === 'light',
          action: toggleTheme
        },
        { icon: Bell, label: 'Notifications', description: 'Manage notification preferences', action: () => navigate('/notifications') },
        { icon: Globe, label: 'Language', description: 'English (US)', action: () => toast.info('Language settings - Coming soon!') },
      ]
    },
    {
      title: 'Financial',
      items: [
        { icon: CreditCard, label: 'Payment Methods', description: 'Manage cards and bank accounts', action: () => toast.info('Payment methods - Coming soon!') },
        { icon: BarChart3, label: 'Insights & Analytics', description: 'View your spending and task stats', action: () => toast.info('Insights - Coming soon!') },
        { icon: Database, label: 'Billing History', description: 'View all transactions', action: () => navigate('/wallet') },
      ]
    },
    {
      title: 'Support & Legal',
      items: [
        { icon: HelpCircle, label: 'Help & Support', description: 'Get help with Doerly', action: () => toast.info('Opening support center...') },
        { icon: FileText, label: 'Privacy Policy', description: 'Read our privacy policy', action: () => toast.info('Opening privacy policy...') },
        { icon: FileText, label: 'Terms of Service', description: 'Read our terms', action: () => toast.info('Opening terms of service...') },
        { icon: Info, label: 'About Doerly', description: 'Version 1.0.0', action: () => toast.info('Doerly - Life Tasks, Done For You') },
      ]
    },
    {
      title: 'Danger Zone',
      isDanger: true,
      items: [
        { 
          icon: Trash2, 
          label: 'Delete Account', 
          description: 'Permanently delete your account and data',
          isDanger: true,
          action: () => setShowDeleteDialog(true)
        },
      ]
    }
  ];

  return (
    <div data-testid="settings-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* User Profile Card */}
        {user && (
          <div className="glass-card mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">{user.full_name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">{user.full_name}</h2>
                <p className="text-slate-400">{user.email}</p>
                <span className="inline-block mt-1 px-3 py-1 text-xs font-medium rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {user.user_type === 'helper' ? 'Helper' : 'User'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Settings Sections */}
        {settingsSections.map((section, sectionIdx) => (
          <div key={sectionIdx} className={`mb-8 ${section.isDanger ? 'mt-12' : ''}`}>
            <h3 className={`font-heading text-lg uppercase tracking-wider mb-4 px-2 ${
              section.isDanger ? 'text-red-400' : 'text-slate-500'
            }`}>
              {section.title}
            </h3>
            <div className={`glass-card space-y-2 ${section.isDanger ? 'border-red-500/30' : ''}`}>
              {section.items.map((option, idx) => (
                <button
                  key={idx}
                  onClick={option.action}
                  data-testid={`settings-${option.label.toLowerCase().replace(/\s+/g, '-')}`}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left ${
                    option.isDanger 
                      ? 'hover:bg-red-500/10' 
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    option.isDanger 
                      ? 'bg-red-500/20' 
                      : 'bg-blue-500/20'
                  }`}>
                    <option.icon className={`w-6 h-6 ${
                      option.isDanger ? 'text-red-400' : 'text-blue-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${
                      option.isDanger ? 'text-red-400' : 'text-white'
                    }`}>
                      {option.label}
                    </p>
                    <p className="text-sm text-slate-400">{option.description}</p>
                  </div>
                  {option.isSwitch ? (
                    <Switch
                      checked={option.checked}
                      onCheckedChange={option.action}
                      data-testid="theme-toggle"
                    />
                  ) : (
                    <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <div className="glass-card">
          <button
            onClick={handleLogout}
            data-testid="logout-button"
            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 transition-all text-left"
          >
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <LogOut className="w-6 h-6 text-red-400" />
            </div>
            <span className="text-red-400 font-medium flex-1">Logout</span>
          </button>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-slate-900 border border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Account</DialogTitle>
            <DialogDescription className="text-slate-400">
              This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-4 mt-4">
            <Button
              onClick={() => setShowDeleteDialog(false)}
              className="flex-1 btn-secondary"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAccount}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
            >
              Delete Account
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}