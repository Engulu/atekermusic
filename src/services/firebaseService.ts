import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getPerformance } from 'firebase/performance';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase only if it hasn't been initialized yet
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Initialize services
const auth = getAuth(app);
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});

const storage = getStorage(app);
const functions = getFunctions(app);

// Export initialized services
export { auth, db, storage, functions };

// Initialize emulators in development
if (import.meta.env.DEV) {
  connectFunctionsEmulator(functions, 'localhost', 5001);
}

// Initialize Analytics only in browser
export const analytics = typeof window !== 'undefined' 
  ? isSupported().then(() => getAnalytics(app)).catch(() => null)
  : null;

// Initialize Performance Monitoring
export const performance = typeof window !== 'undefined'
  ? getPerformance(app)
  : null;

// Error tracking
const handleError = (error: unknown) => {
  console.error('Firebase Error:', error);
  // Add your error tracking service here if needed
};

// Export error handler
export { handleError };

// Export the Firebase app instance
export default app;