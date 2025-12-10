import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { api, setAuthToken } from '@/utils/api';

export default function Auth({ setIsAuthenticated }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const response = await api.post('/auth/login', { email, password });
      setAuthToken(response.data.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const full_name = formData.get('full_name');
    const user_type = formData.get('user_type');

    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        full_name,
        user_type,
      });
      setAuthToken(response.data.token);
      setIsAuthenticated(true);
      navigate('/');
    } catch (error) {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      data-testid="auth-page"
      className="min-h-screen bg-[#0F1419] flex items-center justify-center p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-6 flex justify-center">
            {/* Runna-style logo */}
            <div className="relative">
              <div className="text-[80px] font-bold text-white tracking-tight" style={{ fontFamily: 'SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', lineHeight: 1 }}>
                D
              </div>
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full" />
            </div>
          </div>
          <h1 className="font-heading font-light text-5xl tracking-tight text-white mb-2">
            Doerly
          </h1>
          <p className="font-body text-base text-slate-400">Your AI-Powered Task Engine</p>
        </div>

        <div className="glass-card">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-slate-800/50">
              <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-slate-300">Email</Label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    data-testid="login-email-input"
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-slate-300">Password</Label>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    data-testid="login-password-input"
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-12"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full btn-primary h-12"
                  disabled={loading}
                  data-testid="login-submit-button"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="text-slate-300">Full Name</Label>
                  <Input
                    id="register-name"
                    name="full_name"
                    placeholder="Enter your full name"
                    required
                    data-testid="register-name-input"
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="register-email" className="text-slate-300">Email</Label>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    data-testid="register-email-input"
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="register-password" className="text-slate-300">Password</Label>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    data-testid="register-password-input"
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 rounded-xl h-12"
                  />
                </div>
                <div>
                  <Label htmlFor="user-type" className="text-slate-300">Account Type</Label>
                  <div className="relative">
                    <select
                      id="user-type"
                      name="user_type"
                      required
                      data-testid="register-user-type-select"
                      className="w-full bg-slate-950/50 border border-white/10 rounded-xl h-12 px-4 text-white appearance-none cursor-pointer hover:border-blue-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <option value="user" className="bg-slate-900">User (Need help)</option>
                      <option value="helper" className="bg-slate-900">Helper (Provide help)</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full btn-primary h-12"
                  disabled={loading}
                  data-testid="register-submit-button"
                >
                  {loading ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}