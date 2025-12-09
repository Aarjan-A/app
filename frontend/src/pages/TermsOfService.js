import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function TermsOfService() {
  const navigate = useNavigate();

  const sections = [
    {
      icon: CheckCircle,
      title: 'Acceptance of Terms',
      content: 'By accessing and using Doerly, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.'
    },
    {
      icon: FileText,
      title: 'Service Description',
      content: 'Doerly provides a platform for task automation and helper marketplace services. We connect users with AI-powered solutions and verified human helpers to complete various tasks.'
    },
    {
      icon: AlertCircle,
      title: 'User Responsibilities',
      content: 'You are responsible for maintaining the confidentiality of your account, providing accurate information, and complying with all applicable laws when using our services.'
    },
    {
      icon: XCircle,
      title: 'Prohibited Activities',
      content: 'Users may not engage in illegal activities, harassment, fraud, spam, or any activity that violates these terms. We reserve the right to suspend or terminate accounts that violate our policies.'
    },
    {
      icon: FileText,
      title: 'Payment Terms',
      content: 'All payments are processed securely. Users agree to pay for services rendered. Refunds are handled on a case-by-case basis according to our refund policy.'
    },
    {
      icon: AlertCircle,
      title: 'Limitation of Liability',
      content: 'Doerly is provided "as is" without warranties. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services.'
    }
  ];

  return (
    <div data-testid="terms-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Terms of Service</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-4">Terms & Conditions</h2>
          <p className="text-slate-400 text-lg">Effective Date: January 2025</p>
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
          <h3 className="font-heading text-xl text-white mb-3">Contact Information</h3>
          <p className="text-slate-300 mb-4">For questions about these Terms of Service:</p>
          <div className="flex flex-col gap-2 text-blue-400">
            <span>Email: legal@doerly.com</span>
            <span>Phone: +1 (555) 123-4567</span>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}