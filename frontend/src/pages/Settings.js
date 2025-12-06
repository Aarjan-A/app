import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { clearAuthToken } from '@/utils/api';
import { ArrowLeft, User, Shield, CreditCard, Bell, HelpCircle, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export default function Settings() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuthToken();
    toast.success('Logged out successfully');
    navigate('/auth');
    window.location.reload();
  };

  const settingsOptions = [
    { icon: User, label: 'Profile', path: '#' },
    { icon: Shield, label: 'Security', path: '#' },
    { icon: CreditCard, label: 'Payment Methods', path: '#' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: HelpCircle, label: 'Support', path: '#' },
  ];

  return (
    <div data-testid="settings-page" className="min-h-screen bg-[#020617]">
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
          <h1 className="font-heading font-light text-2xl text-white">Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="glass-card">
          <div className="space-y-2">
            {settingsOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => option.path !== '#' && navigate(option.path)}
                data-testid={`settings-${option.label.toLowerCase().replace(' ', '-')}`}
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-800/50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <option.icon className="w-5 h-5 text-blue-400" />
                </div>
                <span className="text-white font-medium flex-1">{option.label}</span>
                <ArrowLeft className="w-5 h-5 text-slate-400 rotate-180" />
              </button>
            ))}

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={handleLogout}
                data-testid="logout-button"
                className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-red-500/10 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                  <LogOut className="w-5 h-5 text-red-400" />
                </div>
                <span className="text-red-400 font-medium flex-1">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
