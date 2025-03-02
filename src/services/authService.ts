import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseService';
import type { User } from '../types';
import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGES = {
  'auth/email-already-in-use': 'An account with this email already exists',
  'auth/invalid-email': 'Please enter a valid email address',
  'auth/weak-password': 'Password should be at least 6 characters',
  'auth/user-not-found': 'No account found with this email',
  'auth/wrong-password': 'Incorrect password',
  'auth/network-request-failed': 'Network error. Please check your connection',
  'default': 'An error occurred. Please try again'
};

export const signUp = async (
  email: string,
  password: string,
  displayName: string,
  role: 'user' | 'artist'
): Promise<User> => {
  try {
    // Input validation
    if (!email || !password || !displayName) {
      throw new Error('All fields are required');
    }

    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user: firebaseUser } = userCredential;

    // Send email verification
    try {
      await sendEmailVerification(firebaseUser);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      // Continue with signup even if verification email fails
    }

    // Create user document in Firestore
    const userData: User = {
      id: firebaseUser.uid,
      email,
      displayName,
      role,
      isVerified: false,
      isEmailVerified: false,
      isApproved: role === 'user', // Artists need approval
      createdAt: new Date().toISOString(),
      followers: 0,
      following: []
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);
    return userData;
  } catch (error) {
    if (error instanceof FirebaseError) {
      throw new Error(AUTH_ERROR_MESSAGES[error.code as keyof typeof AUTH_ERROR_MESSAGES] || AUTH_ERROR_MESSAGES.default);
    }
    throw new Error(AUTH_ERROR_MESSAGES.default);
  }
};

export const signIn = async (email: string, password: string): Promise<User> => {
  try {
    const { user: firebaseUser } = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    return userDoc.data() as User;
  } catch (error) {
    console.error('Error during sign in:', error);
    throw error;
  }
};

export const followArtist = async (userId: string, artistId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const artistRef = doc(db, 'users', artistId);
    
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as User;
    
    if (!userData.following.includes(artistId)) {
      // Update user's following list
      await updateDoc(userRef, {
        following: [...userData.following, artistId]
      });
      
      // Increment artist's followers count
      await updateDoc(artistRef, {
        followers: (userData.followers || 0) + 1
      });
    }
  } catch (error) {
    console.error('Error following artist:', error);
    throw error;
  }
};

export const unfollowArtist = async (userId: string, artistId: string): Promise<void> => {
  try {
    const userRef = doc(db, 'users', userId);
    const artistRef = doc(db, 'users', artistId);
    
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data() as User;
    
    if (userData.following.includes(artistId)) {
      // Update user's following list
      await updateDoc(userRef, {
        following: userData.following.filter(id => id !== artistId)
      });
      
      // Decrement artist's followers count
      await updateDoc(artistRef, {
        followers: Math.max((userData.followers || 0) - 1, 0)
      });
    }
  } catch (error) {
    console.error('Error unfollowing artist:', error);
    throw error;
  }
};

export const getTopArtists = async (limit: number = 10): Promise<User[]> => {
  try {
    const usersRef = db.collection('users');
    const artistsQuery = usersRef
      .where('role', '==', 'artist')
      .where('isApproved', '==', true)
      .orderBy('followers', 'desc')
      .limit(limit);
    
    const snapshot = await artistsQuery.get();
    return snapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    throw error;
  }
};