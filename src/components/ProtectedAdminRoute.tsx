import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebaseService';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        navigate('/signin');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.id));
        const isUserAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';
        setIsAdmin(isUserAdmin);
        if (!isUserAdmin) {
          navigate('/');
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [currentUser, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-navy-900 pt-24 pb-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    );
  }

  return isAdmin ? <>{children}</> : null;
} 