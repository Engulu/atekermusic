import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
  increment,
  writeBatch
} from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from './firebaseService';
import type { User, Song } from '../types';

export const getAdminStats = async () => {
  const stats = {
    totalUsers: 0,
    totalArtists: 0,
    totalSongs: 0,
    totalDownloads: 0,
    totalRevenue: 0
  };

  try {
    // Get user stats
    const usersQuery = query(collection(db, 'users'));
    const artistsQuery = query(collection(db, 'users'), where('role', '==', 'artist'));
    const songsQuery = query(collection(db, 'songs'));

    const [usersSnapshot, artistsSnapshot, songsSnapshot] = await Promise.all([
      getDocs(usersQuery),
      getDocs(artistsQuery),
      getDocs(songsQuery)
    ]);

    stats.totalUsers = usersSnapshot.size;
    stats.totalArtists = artistsSnapshot.size;
    stats.totalSongs = songsSnapshot.size;

    // Calculate total downloads and revenue
    songsSnapshot.forEach(doc => {
      const song = doc.data();
      stats.totalDownloads += song.downloadCount || 0;
      stats.totalRevenue += (song.price || 0) * (song.downloadCount || 0);
    });

    return stats;
  } catch (error) {
    console.error('Error getting admin stats:', error);
    throw error;
  }
};

export const getUnapprovedArtists = async (): Promise<User[]> => {
  try {
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'artist'),
      where('isApproved', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as User));
  } catch (error) {
    console.error('Error getting unapproved artists:', error);
    throw error;
  }
};

export const getPendingSongs = async (): Promise<Song[]> => {
  try {
    const q = query(
      collection(db, 'songs'),
      where('isApproved', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Song));
  } catch (error) {
    console.error('Error getting pending songs:', error);
    throw error;
  }
};

export const deleteArtist = async (artistId: string) => {
  try {
    const batch = writeBatch(db);
    
    // Delete artist's songs from storage
    const songsQuery = query(collection(db, 'songs'), where('artistId', '==', artistId));
    const songsSnapshot = await getDocs(songsQuery);
    
    const deletePromises = songsSnapshot.docs.map(async songDoc => {
      const song = songDoc.data();
      
      // Delete song file
      if (song.songUrl) {
        const songRef = ref(storage, song.songUrl);
        await deleteObject(songRef);
      }
      
      // Delete cover image
      if (song.coverUrl) {
        const coverRef = ref(storage, song.coverUrl);
        await deleteObject(coverRef);
      }
      
      // Delete song document
      batch.delete(songDoc.ref);
    });
    
    await Promise.all(deletePromises);
    
    // Delete artist document
    batch.delete(doc(db, 'users', artistId));
    
    // Delete artist profile image if exists
    const artist = (await getDoc(doc(db, 'users', artistId))).data();
    if (artist?.imageUrl) {
      const imageRef = ref(storage, artist.imageUrl);
      await deleteObject(imageRef);
    }
    
    await batch.commit();
  } catch (error) {
    console.error('Error deleting artist:', error);
    throw error;
  }
};

export const deleteSong = async (songId: string) => {
  try {
    const songDoc = await getDoc(doc(db, 'songs', songId));
    const song = songDoc.data();
    
    if (!song) {
      throw new Error('Song not found');
    }
    
    // Delete song file from storage
    if (song.songUrl) {
      const songRef = ref(storage, song.songUrl);
      await deleteObject(songRef);
    }
    
    // Delete cover image from storage
    if (song.coverUrl) {
      const coverRef = ref(storage, song.coverUrl);
      await deleteObject(coverRef);
    }
    
    // Delete song document
    await deleteDoc(doc(db, 'songs', songId));
    
    // Update artist's song count
    await updateDoc(doc(db, 'users', song.artistId), {
      totalSongs: increment(-1)
    });
  } catch (error) {
    console.error('Error deleting song:', error);
    throw error;
  }
};