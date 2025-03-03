import { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../services/firebaseService';
import { doc, getDoc } from 'firebase/firestore';
import type { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (user) {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (!userDoc.exists()) {
            console.error('User document not found');
            setCurrentUser(null);
            return;
          }
          const userData = userDoc.data() as User;
          setCurrentUser({ ...userData, id: user.uid });
        } else {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);