import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFirebase } from '../contexts/FirebaseContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { currentUser } = useFirebase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
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
    return <div>Loading...</div>;
  }

  return isAdmin ? <>{children}</> : null;
} 