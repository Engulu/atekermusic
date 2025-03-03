import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseService';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (authLoading) return;

      if (!currentUser) {
        navigate('/signin');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.id));
        if (!userDoc.exists()) {
          setError('User data not found');
          navigate('/');
          return;
        }

        const isUserAdmin = userDoc.data()?.role === 'admin';
        setIsAdmin(isUserAdmin);
        if (!isUserAdmin) {
          setError('Access denied. Admin privileges required.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setError('Error checking admin status');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser, authLoading, navigate]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-navy-900 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-navy-900 pt-24 pb-16 flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
        </div>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : null;
} 