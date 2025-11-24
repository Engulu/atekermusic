import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireApproval?: boolean;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({
  children,
  requireApproval = false,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { user, profile, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation('/login');
    return null;
  }

  if (requireAdmin && profile?.role !== 'admin') {
    setLocation('/');
    return null;
  }

  if (requireApproval && !profile?.is_approved) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">
            Account Pending Approval
          </h2>
          <p className="text-muted-foreground mb-6">
            Your artist account is currently under review by our admin team. 
            You will be notified via email once your account is approved.
          </p>
          <p className="text-sm text-muted-foreground">
            This usually takes 24-48 hours. Thank you for your patience!
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
