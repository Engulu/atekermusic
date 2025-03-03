import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, updatePassword } from 'firebase/auth';

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

const EMAIL = 'enochaengulu@gmail.com';
const OLD_PASSWORD = '2019JUSTgot';
const NEW_PASSWORD = '2019JUSTgot123'; // Using a slightly different password

async function resetPassword() {
  try {
    // First sign in
    const userCredential = await signInWithEmailAndPassword(auth, EMAIL, OLD_PASSWORD);
    const user = userCredential.user;
    
    // Then update password
    await updatePassword(user, NEW_PASSWORD);
    console.log('✅ Password updated successfully!');
    console.log('New password is:', NEW_PASSWORD);
    
  } catch (error) {
    if (error.code === 'auth/invalid-credential') {
      console.error('❌ Current password is incorrect. Let\'s try another approach...');
      // We might need to use the Firebase Console to reset the password
    } else {
      console.error('❌ Error resetting password:', error);
    }
  }
}

resetPassword();
