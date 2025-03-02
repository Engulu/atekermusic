import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
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

async function createAdmin() {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  try {
    // Create user account
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      'enochaengulu@gmail.com',
      '2019JUSTgot'
    );
    
    const userId = userCredential.user.uid;

    // Create admin user document
    await setDoc(doc(db, 'users', userId), {
      email: 'enochaengulu@gmail.com',
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
      lastLogin: new Date(),
      permissions: ['manage_users', 'manage_content', 'view_analytics', 'manage_settings'],
      securitySettings: {
        twoFactorEnabled: false,
        lastPasswordChange: new Date(),
        loginAttempts: 0,
        accountLocked: false
      }
    });

    console.log('✅ Admin user created successfully!');
    return { success: true, userId };
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    return { success: false, error };
  }
}

// Run the function
createAdmin(); 