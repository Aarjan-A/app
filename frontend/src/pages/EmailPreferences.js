import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Mail, Bell, MessageSquare, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function EmailPreferences() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState({
    taskUpdates: true,
    paymentNotifications: true,
    weeklyDigest: true,
    marketingEmails: false,
    helperMessages: true,
    automationAlerts: true
  });

  const handleToggle = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    // Save to backend
    localStorage.setItem('email_preferences', JSON.stringify(preferences));
    toast.success('Email preferences saved successfully');
  };

  useEffect(() => {
    // Load from localStorage
    const saved = localStorage.getItem('email_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse preferences');
      }
    }
  }, []);

  const preferenceItems = [
    {
      key: 'taskUpdates',
      icon: Bell,
      title: 'Task Updates',
      description: 'Get notified when your tasks are updated or completed'
    },
    {
      key: 'paymentNotifications',
      icon: TrendingUp,
      title: 'Payment Notifications',
      description: 'Receive alerts for payments and transactions'
    },
    {
      key: 'weeklyDigest',
      icon: MessageSquare,
      title: 'Weekly Digest',
      description: 'Summary of your weekly activity and insights'
    },
    {
      key: 'marketingEmails',
      icon: Mail,
      title: 'Marketing Emails',
      description: 'Promotional offers and feature announcements'
    },
    {
      key: 'helperMessages',
      icon: MessageSquare,
      title: 'Helper Messages',
      description: 'Messages and updates from helpers'
    },
    {
      key: 'automationAlerts',
      icon: Bell,
      title: 'Automation Alerts',
      description: 'Notifications when automations run or fail'
    }
  ];

  return (
    <div data-testid="email-preferences-page" className="min-h-screen bg-[#0F1419] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Email Preferences</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">Manage Your Emails</h2>
          <p className="text-slate-400 text-lg">Choose what emails you want to receive</p>
        </div>

        <div className="glass-card space-y-4">
          {preferenceItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-800/50 transition-all"
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{item.title}</p>
                  <p className="text-slate-400 text-sm">{item.description}</p>
                </div>
              </div>
              <Switch
                checked={preferences[item.key]}
                onCheckedChange={() => handleToggle(item.key)}
              />
            </div>
          ))}
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
            className="flex-1 btn-primary"
          >
            Save Preferences
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}