import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Music, Mail, Lock, LogIn } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { toast } from 'sonner';

export default function Login() {
  const [, setLocation] = useLocation();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      setLocation('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to sign in');
    } finally { setLoading(false); }
  };

  const handleGoogleSignIn = async () => {
    try { await signInWithGoogle(); } 
    catch (error: any) { toast.error(error.message || 'Failed with Google'); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center gap-2 mb-8"><Music className="w-8 h-8 text-primary" /><span className="text-2xl font-bold text-card-foreground">Ateker Music</span></div>
        <div className="text-center mb-8"><h1 className="text-3xl font-bold text-card-foreground mb-2">Welcome Back</h1><p className="text-muted-foreground">Sign in to your artist account</p></div>

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div><label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">Email</label>
            <div className="relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" className="pl-10" />
            </div>
          </div>

          <div><label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">Password</label>
            <div className="relative"><Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="pl-10" />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full"><LogIn className="w-4 h-4 mr-2" />{loading ? 'Signing in...' : 'Sign In'}</Button>
        </form>

        <div className="relative mb-6"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
        </div>

        <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full mb-6">Sign in with Google</Button>

        <p className="text-center text-sm text-muted-foreground">Don't have an account? <Link href="/register"><a
