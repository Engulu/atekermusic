import { doc, updateDoc, getDoc, arrayUnion, arrayRemove, increment, collection, query, where, orderBy, limit, getDocs, writeBatch } from 'firebase/firestore';
import { db } from './firebaseService';
import type { User, ArtistProfile } from '../types';

export const isFollowingArtist = async (userId: string, artistId: string): Promise<boolean> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return false;
    
    const userData = userDoc.data() as User;
    return userData.following?.includes(artistId) || false;
  } catch (error) {
    console.error('Error checking follow status:', error);
    return false;
  }
};

export const followArtist = async (userId: string, artistId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const artistRef = doc(db, 'users', artistId);

  const batch = writeBatch(db);

  // Add artist to user's following list
  batch.update(userRef, {
    following: arrayUnion(artistId)
  });

  // Increment artist's followers count
  batch.update(artistRef, {
    followers: increment(1)
  });

  await batch.commit();
};

export const unfollowArtist = async (userId: string, artistId: string): Promise<void> => {
  const userRef = doc(db, 'users', userId);
  const artistRef = doc(db, 'users', artistId);

  const batch = writeBatch(db);

  // Remove artist from user's following list
  batch.update(userRef, {
    following: arrayRemove(artistId)
  });

  // Decrement artist's followers count
  batch.update(artistRef, {
    followers: increment(-1)
  });

  await batch.commit();
};

export const getArtistProfile = async (artistId: string): Promise<User> => {
  try {
    const artistDoc = await getDoc(doc(db, 'users', artistId));
    if (!artistDoc.exists()) {
      throw new Error('Artist not found');
    }
    return { id: artistDoc.id, ...artistDoc.data() } as User;
  } catch (error) {
    console.error('Error fetching artist profile:', error);
    throw error;
  }
};

export const getTopArtists = async (limit: number = 10): Promise<User[]> => {
  try {
    const snapshot = await db
      .collection('users')
      .where('role', '==', 'artist')
      .where('isApproved', '==', true)
      .orderBy('followers', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map(doc => doc.data() as User);
  } catch (error) {
    console.error('Error fetching top artists:', error);
    return [];
  }
};