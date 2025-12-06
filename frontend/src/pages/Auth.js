import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { api, setAuthToken } from '@/utils/api';
import { Zap } from 'lucide-react';

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
      className="min-h-screen bg-[#020617] flex items-center justify-center p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-[0_0_30px_rgba(37,99,235,0.4)]">
              <Zap className="w-8 h-8 text-white" />
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
                    className="bg-slate-950/50 border-white/10 text-white"
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
                    className="bg-slate-950/50 border-white/10 text-white"
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
                    placeholder="John Doe"
                    required
                    data-testid="register-name-input"
                    className="bg-slate-950/50 border-white/10 text-white"
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
                    className="bg-slate-950/50 border-white/10 text-white"
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
                    className="bg-slate-950/50 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="user-type" className="text-slate-300">Account Type</Label>
                  <select
                    id="user-type"
                    name="user_type"
                    required
                    data-testid="register-user-type-select"
                    className="w-full bg-slate-950/50 border border-white/10 rounded-xl h-12 px-4 text-white"
                  >
                    <option value="user">User (Need help)</option>
                    <option value="helper">Helper (Provide help)</option>
                  </select>
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
