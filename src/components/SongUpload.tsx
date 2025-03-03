import React, { useState } from 'react';
import { uploadAudio } from '../services/cloudinary';
import toast from 'react-hot-toast';

interface SongUploadProps {
  onUploadComplete: (url: string) => void;
}

const SongUpload: React.FC<SongUploadProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadAudio(file);
      onUploadComplete(url);
      toast.success('Audio uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload audio');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="w-full p-2 border rounded"
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
};

export default SongUpload;
