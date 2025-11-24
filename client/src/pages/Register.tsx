import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Music, Mail, Lock, User, Phone, CreditCard, MapPin, Eye, EyeOff } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { toast } from 'sonner';
import { UNIQUE_DISTRICTS, UGANDA_LANGUAGES } from '@/lib/ugandaData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Register() {
  const [, setLocation] = useLocation();
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    display_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    nin: '',
    district: '',
    custom_district: '',
    sub_county: '',
    parish: '',
    village: '',
    bio: '',
    language: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.nin || formData.nin.length < 10) {
      toast.error('Please enter a valid National Identification Number');
      return;
    }

    if (!formData.phone) {
      toast.error('Phone number is required');
      return;
    }

    if (!formData.district) {
      toast.error('Please select your district');
      return;
    }

    setLoading(true);

    try {
      const { confirmPassword, ...profileData } = formData;
      await signUp(formData.email, formData.password, profileData);
      
      toast.success(
        'Account created! Your profile is pending admin approval. You will be notified once approved.',
        { duration: 5000 }
      );
      
      setLocation('/login');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-background p-4 py-12">
      <Card className="w-full max-w-2xl p-8">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-card-foreground">Ateker Music</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-card-foreground mb-2">Join as an Artist</h1>
          <p className="text-muted-foreground">
            Create your account and start sharing your music
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="display_name" className="block text-sm font-medium text-card-foreground mb-2">
                Artist Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="display_name"
                  name="display_name"
                  type="text"
                  required
                  value={formData.display_name}
                  onChange={handleChange}
                  placeholder="Your stage name"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                Email *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-card-foreground mb-2">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+256 700 000000"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="nin" className="block text-sm font-medium text-card-foreground mb-2">
                National ID Number (NIN) *
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="nin"
                  name="nin"
                  type="text"
                  required
                  value={formData.nin}
                  onChange={handleChange}
                  placeholder="CM00000000000XX"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="district" className="block text-sm font-medium text-card-foreground mb-2">
                District *
              </label>
              <Select
                value={formData.district}
                onValueChange={(value) => setFormData({ ...formData, district: value })}
              >
                  <SelectTrigger>
                    <SelectValue placeholder="Select district" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    {UNIQUE_DISTRICTS.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                    <SelectItem value="Other">Other (Specify below)</SelectItem>
                  </SelectContent>
              </Select>
            </div>

            {/* Custom District Input (shown when "Other" is selected) */}
            {formData.district === 'Other' && (
              <div>
                <label htmlFor="custom_district" className="block text-sm font-medium text-card-foreground mb-2">
                  Specify Your District *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="custom_district"
                    name="custom_district"
                    type="text"
                    value={formData.custom_district}
                    onChange={handleChange}
                    placeholder="Enter your district name"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="sub_county" className="block text-sm font-medium text-card-foreground mb-2">
                Sub-County
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="sub_county"
                  name="sub_county"
                  type="text"
                  value={formData.sub_county}
                  onChange={handleChange}
                  placeholder="Your sub-county"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="parish" className="block text-sm font-medium text-card-foreground mb-2">
                Parish
              </label>
              <Input
                id="parish"
                name="parish"
                type="text"
                value={formData.parish}
                onChange={handleChange}
                placeholder="Your parish"
              />
            </div>

            <div>
              <label htmlFor="village" className="block text-sm font-medium text-card-foreground mb-2">
                Village (Optional)
              </label>
              <Input
                id="village"
                name="village"
                type="text"
                value={formData.village}
                onChange={handleChange}
                placeholder="Your village"
              />
            </div>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-card-foreground mb-2">
              Primary Language
            </label>
            <Select
              value={formData.language}
              onValueChange={(value) => setFormData({ ...formData, language: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your primary language" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {UGANDA_LANGUAGES.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-card-foreground mb-2">
              Bio (Optional)
            </label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself and your music..."
              rows={3}
            />
          </div>

          {/* Terms */}
          <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground">
            <p>
              By signing up, you agree to our{' '}
              <Link href="/terms">
                <a className="text-primary hover:underline">Terms & Conditions</a>
              </Link>
              {' '}and{' '}
              <Link href="/artist-agreement">
                <a className="text-primary hover:underline">Artist Agreement</a>
              </Link>
              . Your account will be reviewed by our admin team before approval.
            </p>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Creating Account...' : 'Create Artist Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
          </div>
        </div>

        {/* Social Sign Up Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              try {
                await signInWithGoogle();
              } catch (error: any) {
                console.error('Google sign up error:', error);
                toast.error(error.message || 'Failed to sign up with Google');
              }
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              try {
                await signInWithFacebook();
              } catch (error: any) {
                console.error('Facebook sign up error:', error);
                toast.error(error.message || 'Failed to sign up with Facebook');
              }
            }}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook
          </Button>
        </div>

        {/* Sign In Link */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{' '}
          <Link href="/login">
            <a className="text-primary hover:underline font-medium">Sign in</a>
          </Link>
        </p>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link href="/">
            <a className="text-sm text-muted-foreground hover:text-primary">
              ← Back to home
            </a>
          </Link>
        </div>
      </Card>
    </div>
  );
}
