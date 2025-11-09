import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Music, User, Mail, Lock, Phone, CreditCard, MapPin } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { toast } from 'sonner';
import { DISTRICTS } from '@/lib/supabase';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function Register() {
  const [, setLocation] = useLocation();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nin: '',
    district: '',
    sub_county: '',
    parish: '',
    village: '',
    bio: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) return toast.error('Passwords do not match');
    if (formData.password.length < 6) return toast.error('Password must be at least 6 characters');
    if (!formData.nin || formData.nin.length < 10) return toast.error('Please enter a valid National ID');
    if (!formData.phone) return toast.error('Phone number is required');
    if (!formData.district) return toast.error('Please select your district');

    setLoading(true);

    try {
      const { display_name, email, password, confirmPassword, ...profileData } = formData;
      await signUp(email, password, profileData);

      toast.success('Account created! Pending admin approval.');
      setLocation('/login');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4 py-12">
      <Card className="w-full max-w-2xl p-8">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-card-foreground">Ateker Music</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Join as an Artist</h1>
          <p className="text-muted-foreground">Create your account and start sharing your music</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-card-foreground mb-2">Artist Name *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="display_name" name="display_name" required value={formData.display_name} onChange={handleChange} placeholder="Your stage name" className="pl-10" />
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} placeholder="••••••••" className="pl-10" />
              </div>
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground mb-2">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-2">Phone Number *</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="phone" name="phone" type="tel" required value={formData.phone} onChange={handleChange} placeholder="+256 700 000000" className="pl-10" />
              </div>
            </div>
            <div>
              <label htmlFor="nin" className="block text-sm font-medium text-card-foreground mb-2">National ID (NIN) *</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="nin" name="nin" type="text" required value={formData.nin} onChange={handleChange} placeholder="CM00000000000XX" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-card-foreground mb-2">District *</label>
              <Select value={formData.district} onValueChange={(value) => setFormData({ ...formData, district: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {DISTRICTS.map((district) => <SelectItem key={district} value={district}>{district}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="sub_county" className="block text-sm font-medium text-card-foreground mb-2">Sub-County</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input id="sub_county" name="sub_county" value={formData.sub_county} onChange={handleChange} placeholder="Your sub-county" className="pl-10" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Input id="parish" name="parish" value={formData.parish} onChange={handleChange} placeholder="Parish" /></div>
            <div><Input id="village" name="village" value={formData.village} onChange={handleChange} placeholder="Village" /></div>
          </div>

          <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." rows={3} />

          <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
            By signing up, you agree to our <Link href="/terms"><a className="text-primary hover:underline">Terms</a></Link> and <Link href="/artist-agreement"><a className="text-primary hover:underline">Artist Agreement</a></Link>. Your account will be reviewed by admin.
          </div>

          <Button type="submit" disabled={loading} className="w-full">{loading ? 'Creating Account...' : 'Create Artist Account'}</Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link href="/login"><a className="text-primary hover:underline">Sign in</a></Link>
        </p>

        <div className="mt-4 text-center"><Link href="/"><a className="text-sm text-muted-foreground hover:text-primary">← Back to home</a></Link></div>
      </Card>
    </div>
  );
}
