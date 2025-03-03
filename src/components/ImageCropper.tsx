import { useState, useRef } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { Upload, X, RotateCcw, RotateCw, ZoomIn, ZoomOut, FlipHorizontal, FlipVertical } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageCropperProps {
  onCrop: (croppedImage: string) => void;
  onCancel: () => void;
  aspectRatio?: number;
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
}

export default function ImageCropper({ 
  onCrop, 
  onCancel, 
  aspectRatio = 1,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.8
}: ImageCropperProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isCompressing, setIsCompressing] = useState(false);
  const cropperRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.match(/^image\/(jpeg|png)$/)) {
      alert('Please upload a JPEG or PNG image');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('Image size should be less than 10MB');
      return;
    }

    try {
      setIsCompressing(true);
      
      // Compress image before loading
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: Math.max(maxWidth, maxHeight),
        useWebWorker: true,
        fileType: file.type,
        initialQuality: quality
      };

      const compressedFile = await imageCompression(file, options);
      const reader = new FileReader();
      
      reader.onload = () => {
        setImage(reader.result as string);
      };
      
      reader.readAsDataURL(compressedFile);
    } catch (error) {
      console.error('Error compressing image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  const handleCrop = async () => {
    if (!cropperRef.current) return;

    try {
      setIsCompressing(true);
      const canvas = cropperRef.current.cropper.getCroppedCanvas({
        width: maxWidth,
        height: maxHeight,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, 'image/jpeg', quality);
      });

      // Compress the cropped image
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: Math.max(maxWidth, maxHeight),
        useWebWorker: true,
        fileType: 'image/jpeg',
        initialQuality: quality
      };

      const compressedBlob = await imageCompression(blob, options);
      const reader = new FileReader();
      
      reader.onload = () => {
        onCrop(reader.result as string);
      };
      
      reader.readAsDataURL(compressedBlob);
    } catch (error) {
      console.error('Error processing cropped image:', error);
      alert('Error processing image. Please try again.');
    } finally {
      setIsCompressing(false);
    }
  };

  // Cropper control functions
  const rotateLeft = () => {
    cropperRef.current?.cropper.rotate(-90);
  };

  const rotateRight = () => {
    cropperRef.current?.cropper.rotate(90);
  };

  const zoomIn = () => {
    cropperRef.current?.cropper.zoom(0.1);
  };

  const zoomOut = () => {
    cropperRef.current?.cropper.zoom(-0.1);
  };

  const flipHorizontal = () => {
    cropperRef.current?.cropper.scaleX(cropperRef.current.cropper.getData().scaleX * -1);
  };

  const flipVertical = () => {
    cropperRef.current?.cropper.scaleY(cropperRef.current.cropper.getData().scaleY * -1);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-navy-900 rounded-lg p-6 max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Edit Profile Picture</h2>
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
              disabled={isCompressing}
            >
              <Upload className="w-5 h-5" />
              <span>{isCompressing ? 'Processing...' : 'Choose Image'}</span>
            </button>
            <p className="mt-2 text-gray-400 text-sm">
              Supported formats: JPEG, PNG (max 10MB)
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
                responsive={true}
                zoomable={true}
                scalable={true}
                rotatable={true}
                flip={true}
              />
            </div>

            {/* Image editing controls */}
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={rotateLeft}
                className="p-2 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg"
                title="Rotate Left"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={rotateRight}
                className="p-2 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg"
                title="Rotate Right"
              >
                <RotateCw className="w-5 h-5" />
              </button>
              <button
                onClick={zoomIn}
                className="p-2 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg"
                title="Zoom In"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                onClick={zoomOut}
                className="p-2 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg"
                title="Zoom Out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <button
                onClick={flipHorizontal}
                className="p-2 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg"
                title="Flip Horizontal"
              >
                <FlipHorizontal className="w-5 h-5" />
              </button>
              <button
                onClick={flipVertical}
                className="p-2 text-gray-400 hover:text-white hover:bg-navy-800 rounded-lg"
                title="Flip Vertical"
              >
                <FlipVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setImage(null)}
                className="px-4 py-2 text-gray-400 hover:text-white"
                disabled={isCompressing}
              >
                Cancel
              </button>
              <button
                onClick={handleCrop}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                disabled={isCompressing}
              >
                {isCompressing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
