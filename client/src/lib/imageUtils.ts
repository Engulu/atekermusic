/**
 * Image utilities for cropping and compression
 */

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Load an image from a file
 */
export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load image'));
    };
    
    img.src = url;
  });
}

/**
 * Crop image to square and compress
 */
export async function cropAndCompressImage(
  file: File,
  maxSizeKB: number = 1024,
  outputSize: number = 800
): Promise<File> {
  const img = await loadImage(file);
  
  // Create canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Failed to get canvas context');
  }
  
  // Calculate crop area (center square)
  const size = Math.min(img.width, img.height);
  const x = (img.width - size) / 2;
  const y = (img.height - size) / 2;
  
  // Set canvas size
  canvas.width = outputSize;
  canvas.height = outputSize;
  
  // Draw cropped and resized image
  ctx.drawImage(
    img,
    x, y, size, size,
    0, 0, outputSize, outputSize
  );
  
  // Compress to target size
  let quality = 0.9;
  let blob: Blob | null = null;
  
  while (quality > 0.1) {
    blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob((b) => resolve(b), 'image/jpeg', quality);
    });
    
    if (!blob) {
      throw new Error('Failed to create blob');
    }
    
    if (blob.size <= maxSizeKB * 1024) {
      break;
    }
    
    quality -= 0.1;
  }
  
  if (!blob) {
    throw new Error('Failed to compress image');
  }
  
  // Create new file
  return new File([blob], file.name, {
    type: 'image/jpeg',
    lastModified: Date.now(),
  });
}

/**
 * Validate image file
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }
  
  // Check supported formats
  const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!supportedFormats.includes(file.type)) {
    return { valid: false, error: 'Supported formats: JPEG, PNG, WebP' };
  }
  
  return { valid: true };
}

/**
 * Get image dimensions
 */
export async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  const img = await loadImage(file);
  return { width: img.width, height: img.height };
}

/**
 * Check if image is square
 */
export async function isSquareImage(file: File): Promise<boolean> {
  const { width, height } = await getImageDimensions(file);
  return width === height;
}

/**
 * Create preview URL for image
 */
export function createPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke preview URL
 */
export function revokePreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
