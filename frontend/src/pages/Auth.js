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
      toast.success('Welcome back!');
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
      toast.success('Account created!');
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
      className="min-h-screen bg-gradient-to-br from-[#0A0E27] via-[#1C1F3A] to-[#0A0E27] flex items-center justify-center p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/3 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/30 to-purple-600/30 rounded-[22px] blur-lg" />
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-[22px] shadow-[0_6px_24px_rgba(59,130,246,0.4)]">
                <div className="absolute inset-[1.5px] bg-gradient-to-br from-white/10 to-transparent rounded-[20px]" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="font-heading font-bold text-5xl text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.3)]">D</div>
              </div>
            </div>
          </div>
          <h1 className="font-heading font-light text-5xl tracking-tight text-white mb-2">
            Doerly
          </h1>
          <p className="font-body text-base text-slate-300">Your AI-Powered Task Engine</p>
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
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
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
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full btn-primary"
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
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
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
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
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
                    className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500"
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
                      className="w-full bg-slate-950/30 backdrop-blur-xl border border-white/20 rounded-2xl h-14 px-4 text-white appearance-none cursor-pointer hover:border-blue-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
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
                  className="w-full btn-primary"
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