import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from './firebaseService';

export const uploadProfilePicture = async (userId: string, file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('Only image files are allowed');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('Image size must be less than 5MB');
    }

    // Create storage reference
    const storageRef = ref(storage, `profiles/${userId}/profile.${file.name.split('.').pop()}`);

    // Upload file
    await uploadBytes(storageRef, file);

    // Get download URL
    const downloadURL = await getDownloadURL(storageRef);

    // Update user document with new profile picture URL
    await updateDoc(doc(db, 'users', userId), {
      profilePicture: downloadURL,
      updatedAt: new Date().toISOString()
    });

    return downloadURL;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

export const deleteProfilePicture = async (userId: string, imageUrl: string): Promise<void> => {
  try {
    // Delete from storage
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);

    // Update user document
    await updateDoc(doc(db, 'users', userId), {
      profilePicture: null,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    throw error;
  }
};