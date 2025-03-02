// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const createAdminUser = async (userId: string) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      role: 'admin',
      createdAt: new Date(),
      status: 'active'
    });
    return true;
  } catch (error) {
    console.error('Error creating admin user:', error);
    return false;
  }
};

export const setupAdminUser = async (email: string, password: string) => {
  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Create admin user document
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      email,
      role: 'admin',
      status: 'active',
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp(),
      permissions: ['manage_users', 'manage_content', 'view_analytics', 'manage_settings'],
      securitySettings: {
        twoFactorEnabled: false,
        lastPasswordChange: serverTimestamp(),
        loginAttempts: 0,
        accountLocked: false
      }
    });

    return { success: true, userId };
  } catch (error) {
    console.error('Error setting up admin user:', error);
    return { success: false, error };
  }
};

export const isAdmin = async (userId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists() && userDoc.data()?.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
};

export const updateAdminSecurity = async (userId: string, settings: {
  twoFactorEnabled?: boolean;
  permissions?: string[];
}) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'securitySettings.twoFactorEnabled': settings.twoFactorEnabled,
      permissions: settings.permissions
    });
    return true;
  } catch (error) {
    console.error('Error updating admin security:', error);
    return false;
  }
};

export { app, analytics, auth, db, storage };

// Add this to check admin status
const checkAdminStatus = async () => {
  if (!currentUser) return;
  const adminStatus = await isAdmin(currentUser.uid);
  console.log('Is admin:', adminStatus);
};
