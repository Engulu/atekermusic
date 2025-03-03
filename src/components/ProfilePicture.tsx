import { useState } from 'react';
import { Camera, Loader2, X } from 'lucide-react';
import { uploadProfilePicture, deleteProfilePicture } from '../services/userService';
import { useAuth } from '../contexts/AuthContext';

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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentUser?.id) return;

    setUploading(true);
    setError(null);

    try {
      const url = await uploadProfilePicture(currentUser.id, file);
      onUpdate?.(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl || !currentUser?.id) return;

    if (!window.confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    setUploading(true);
    setError(null);

    try {
      await deleteProfilePicture(currentUser.id, imageUrl);
      onUpdate?.('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative">
      <div 
        className={`${sizeClasses[size]} rounded-full overflow-hidden bg-navy-700 relative ${
          editable ? 'group' : ''
        }`}
      >
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-navy-700 text-gray-400">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <Camera className="w-6 h-6" />
            )}
          </div>
        )}

        {editable && !uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
            <label className="cursor-pointer p-2 rounded-full bg-blue-500 hover:bg-blue-600 transition">
              <Camera className="w-5 h-5 text-white" />
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
            {imageUrl && (
              <button
                onClick={handleDelete}
                className="absolute top-1 right-1 p-1 rounded-full bg-red-500 hover:bg-red-600 transition"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="absolute top-full mt-2 text-sm text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}