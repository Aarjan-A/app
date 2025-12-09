import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: Shield,
      title: 'Data Protection',
      content: 'We implement industry-standard security measures to protect your personal information. Your data is encrypted both in transit and at rest using AES-256 encryption.'
    },
    {
      icon: Eye,
      title: 'Information We Collect',
      content: 'We collect information you provide directly (name, email, payment details), usage data (tasks created, interactions), and device information (IP address, browser type) to improve our services.'
    },
    {
      icon: Database,
      title: 'How We Use Your Data',
      content: 'Your data is used to provide and improve Doerly services, process payments, send notifications, and ensure platform security. We never sell your personal information to third parties.'
    },
    {
      icon: Lock,
      title: 'Data Retention',
      content: 'We retain your data as long as your account is active. You can request data deletion at any time from Settings > Danger Zone > Delete Account.'
    },
    {
      icon: UserCheck,
      title: 'Your Rights',
      content: 'You have the right to access, correct, or delete your personal data. You can export your data or request account deletion at any time. Contact us at privacy@doerly.com for any privacy concerns.'
    }
  ];

  return (
    <div data-testid="privacy-policy-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Privacy Policy</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-4">Your Privacy Matters</h2>
          <p className="text-slate-400 text-lg">Last updated: January 2025</p>
        </div>

        <div className="space-y-6">
          {sections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <div key={idx} className="glass-card">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl text-white mb-3">{section.title}</h3>
                    <p className="text-slate-300 leading-relaxed">{section.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="glass-card mt-8 border-blue-500/30">
          <h3 className="font-heading text-xl text-white mb-3">Questions or Concerns?</h3>
          <p className="text-slate-300 mb-4">If you have any questions about our privacy practices, please contact us:</p>
          <div className="flex flex-col gap-2 text-blue-400">
            <span>Email: privacy@doerly.com</span>
            <span>Address: 123 Privacy Street, San Francisco, CA 94102</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}