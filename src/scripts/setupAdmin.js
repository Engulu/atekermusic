import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDC9FV7miFb-AUfqlW1yDDh7ywwJNZgKgw",
  authDomain: "atekermusic.firebaseapp.com",
  projectId: "atekermusic",
  storageBucket: "atekermusic.firebasestorage.app",
  messagingSenderId: "613194549100",
  appId: "1:613194549100:web:e20df72f9935cec79c5549",
  measurementId: "G-8NSMQNK0ZT"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function setupAdmin() {
  try {
    // Sign in with existing account
    const userCredential = await signInWithEmailAndPassword(
      auth,
      'enochaengulu@gmail.com',
      '2019JUSTgot'
    );
    
    const userId = userCredential.user.uid;

    // Update admin document
    await setDoc(doc(db, 'users', userId), {
      email: 'enochaengulu@gmail.com',
      role: 'admin',
      status: 'active',
      updatedAt: new Date(),
      lastLogin: new Date(),
      permissions: [
        'manage_users',
        'manage_content',
        'view_analytics',
        'manage_settings',
        'approve_artists'
      ],
      securitySettings: {
        twoFactorEnabled: false,
        lastPasswordChange: new Date(),
        loginAttempts: 0,
        accountLocked: false
      }
    }, { merge: true }); // This will merge with existing document

    console.log('✅ Admin user updated successfully!');
    console.log('User ID:', userId);
    return { success: true, userId };
  } catch (error) {
    console.error('❌ Error updating admin user:', error);
    return { success: false, error };
  }
}

setupAdmin();