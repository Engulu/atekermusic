import { auth, createAdminUser } from '../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

export const setupAdmin = async (email: string, password: string) => {
  try {
    // Sign in the user
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userId = userCredential.user.uid;

    // Create admin user
    const success = await createAdminUser(userId);
    
    if (success) {
      console.log('Admin user created successfully!');
    } else {
      console.error('Failed to create admin user');
    }
  } catch (error) {
    console.error('Error setting up admin:', error);
  }
}; 