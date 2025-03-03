import { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Upload, X } from 'lucide-react';

interface ImageCropperProps {
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
}

export default function ImageCropper({ onCrop, onCancel, aspectRatio = 1 }: ImageCropperProps) {
  const [image, setImage] = useState<string | null>(null);
  const cropperRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      alert('Please upload a JPEG or PNG image');
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    if (cropperRef.current) {
      const canvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 400,
        height: 400,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });
      onCrop(canvas.toDataURL('image/jpeg', 0.9));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-navy-900 rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Crop Profile Picture</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {!image ? (
          <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 mx-auto px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Upload className="w-5 h-5" />
              <span>Choose Image</span>
            </button>
            <p className="mt-2 text-gray-400 text-sm">
              Supported formats: JPEG, PNG (max 5MB)
            </p>
          </div>
        ) : (
          <>
            <div className="h-[400px] mb-4">
              <Cropper
                ref={cropperRef}
                src={image}
                style={{ height: '100%', width: '100%' }}
                aspectRatio={aspectRatio}
                viewMode={1}
                dragMode="move"
                autoCropArea={1}
                restore={false}
                guides={true}
                highlight={false}
                cropBoxMovable={true}
                cropBoxResizable={true}
                toggleDragModeOnDblclick={true}
                circular={true}
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setImage(null)}
                className="px-4 py-2 text-gray-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                Crop & Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
