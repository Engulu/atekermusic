import { useState } from 'react';
import { Camera } from 'lucide-react';
import ImageCropper from './ImageCropper';
import { storage } from '../services/firebaseService';
import { ref, uploadString } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';

interface ProfilePictureProps {
  imageUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onUpdate?: (url: string) => void;
}

export default function ProfilePicture({
  imageUrl,
  size = 'md',
  editable = false,
  onUpdate
}: ProfilePictureProps) {
  const [showCropper, setShowCropper] = useState(false);
  const [loading, setLoading] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  const handleImageUpload = async (croppedImage: string) => {
    try {
      setLoading(true);
      const imageId = uuidv4();
      const imageRef = ref(storage, `profile-pictures/${imageId}.jpg`);
      
      await uploadString(imageRef, croppedImage, 'data_url');
      const url = await imageRef.getDownloadURL();
      
      if (onUpdate) {
        onUpdate(url);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    } finally {
      setLoading(false);
      setShowCropper(false);
    }
  };

  return (
    <div className="relative">
      <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-navy-800`}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Camera className="w-1/2 h-1/2" />
          </div>
        )}
      </div>

      {editable && (
        <button
          onClick={() => setShowCropper(true)}
          className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600"
          disabled={loading}
        >
          <Camera className="w-4 h-4" />
        </button>
      )}

      {showCropper && (
        <ImageCropper
          onCrop={handleImageUpload}
          onCancel={() => setShowCropper(false)}
          aspectRatio={1}
        />
      )}
    </div>
  );
}