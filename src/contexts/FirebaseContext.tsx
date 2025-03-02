// src/contexts/FirebaseContext.tsx
import { createContext, useContext, ReactNode } from 'react';
import { 
  User,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db, storage } from '../lib/firebase';
import { useEffect, useState } from 'react';

// Define the context value type
type FirebaseContextType = {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

// Create context
const FirebaseContext = createContext<FirebaseContextType | null>(null);

// Create provider component
export function FirebaseProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    signOut
  };

  return (
    <FirebaseContext.Provider value={value}>
      {!loading && children}
    </FirebaseContext.Provider>
  );
}

// Create custom hook for using Firebase
export function useFirebase() {
  const context = useContext(FirebaseContext);
  
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  
  return context;
}
