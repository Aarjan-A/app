import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, MessageCircle, Mail, Phone, Book, Video } from 'lucide-react';
import { toast } from 'sonner';
import BottomNav from '@/components/BottomNav';

export default function HelpSupport() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [subject, setSubject] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success('Support ticket submitted! We\'ll get back to you within 24 hours.');
    setMessage('');
    setSubject('');
  };

  const helpCategories = [
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our comprehensive guides and tutorials',
      action: () => toast.info('Opening documentation...')
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Watch step-by-step video guides',
      action: () => toast.info('Opening video library...')
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with our support team in real-time',
      action: () => toast.info('Connecting to live chat...')
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Call us at +1 (555) 123-4567',
      action: () => toast.info('Calling support...')
    },
  ];

  return (
    <div data-testid="help-support-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">Help & Support</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="font-heading font-light text-4xl text-white mb-2">How can we help?</h2>
          <p className="text-slate-400 text-lg">We're here to assist you 24/7</p>
        </div>

        {/* Quick Help Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {helpCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <button
                key={idx}
                onClick={category.action}
                className="glass-card text-left hover:scale-[1.02] transition-all cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl text-white mb-2">{category.title}</h3>
                    <p className="text-slate-400">{category.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Contact Form */}
        <div className="glass-card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Mail className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-heading text-2xl text-white">Send us a message</h3>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="subject" className="text-slate-300 text-base">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="How can we help?"
                required
                className="bg-slate-950/50 border-white/10 text-white h-14"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-slate-300 text-base">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your issue or question..."
                required
                className="bg-slate-950/50 border-white/10 text-white min-h-[150px]"
              />
            </div>
            <Button type="submit" className="w-full btn-primary h-14">
              Submit Ticket
            </Button>
          </form>
        </div>

        {/* FAQ Section */}
        <div className="glass-card mt-8">
          <h3 className="font-heading text-2xl text-white mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {[
              { q: 'How do I create a task?', a: 'Navigate to the Add Task page from the bottom navigation and fill in the task details.' },
              { q: 'How do payments work?', a: 'Add funds to your wallet, and payments are processed automatically when tasks are completed.' },
              { q: 'Can I cancel a task?', a: 'Yes, you can cancel pending tasks from the task details page.' },
              { q: 'How do I become a helper?', a: 'Create an account as a Helper during registration to start accepting tasks.' },
            ].map((faq, idx) => (
              <div key={idx} className="bg-slate-950/50 rounded-2xl p-6 border border-white/5">
                <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                <p className="text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}