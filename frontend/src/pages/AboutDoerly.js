import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Sparkles, Users, Shield, Zap, Heart, Globe } from 'lucide-react';
import BottomNav from '@/components/BottomNav';

export default function AboutDoerly() {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Automation',
      description: 'Leverage cutting-edge AI to automate your daily tasks effortlessly'
    },
    {
      icon: Users,
      title: 'Trusted Helpers',
      description: 'Connect with verified helpers for tasks that need a human touch'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with industry-standard security'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Get tasks done in minutes, not hours or days'
    },
  ];

  const stats = [
    { value: '10,000+', label: 'Active Users' },
    { value: '50,000+', label: 'Tasks Completed' },
    { value: '1,500+', label: 'Verified Helpers' },
    { value: '4.9/5', label: 'Average Rating' },
  ];

  return (
    <div data-testid="about-page" className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] pb-24">
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
          <h1 className="font-heading font-light text-2xl text-white">About Doerly</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="mb-6 flex justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-[32px] shadow-[0_0_60px_rgba(59,130,246,0.6)] animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-heading font-bold text-7xl text-white tracking-tight">D</div>
              </div>
            </div>
          </div>
          <h2 className="font-heading font-light text-5xl text-white mb-4">Doerly</h2>
          <p className="text-slate-300 text-xl mb-4">Life Tasks, Done For You</p>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Doerly is your personal AI-powered task engine that combines automation with human helpers to get your life organized.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="glass-card text-center">
              <h3 className="font-heading text-3xl text-white mb-2">{stat.value}</h3>
              <p className="text-slate-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Features */}
        <div className="glass-card mb-8">
          <h3 className="font-heading text-3xl text-white mb-8 text-center">Why Choose Doerly?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h4 className="font-heading text-xl text-white mb-2">{feature.title}</h4>
                    <p className="text-slate-400">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mission */}
        <div className="glass-card mb-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center flex-shrink-0">
              <Heart className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="font-heading text-2xl text-white mb-3">Our Mission</h3>
              <p className="text-slate-300 leading-relaxed">
                We believe everyone deserves more time to focus on what truly matters. Doerly was built to eliminate the friction of everyday tasks, giving you back precious hours to spend with loved ones, pursue passions, or simply relax.
              </p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="glass-card border-blue-500/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-heading text-2xl text-white mb-3">Get in Touch</h3>
              <div className="text-slate-300 space-y-2">
                <p>Email: hello@doerly.com</p>
                <p>Website: www.doerly.com</p>
                <p>Address: 123 Innovation Drive, San Francisco, CA 94102</p>
              </div>
              <div className="mt-4">
                <p className="text-slate-400 text-sm">Version 1.0.0 • © 2025 Doerly Inc.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}