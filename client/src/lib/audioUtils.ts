/**
 * Audio utilities for MP3 validation and metadata extraction
 */

/**
 * Validate MP3 file
 */
export function validateMP3(file: File): { valid: boolean; error?: string } {
  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== 'mp3') {
    return { valid: false, error: 'Only MP3 files are allowed' };
  }
  
  // Check MIME type
  if (file.type !== 'audio/mpeg' && file.type !== 'audio/mp3') {
    return { valid: false, error: 'Invalid file type. Must be MP3 (audio/mpeg)' };
  }
  
  // Check file size (8MB max as per specs)
  const maxSize = 8 * 1024 * 1024; // 8MB in bytes
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size must be less than 8MB. Current size: ${(file.size / (1024 * 1024)).toFixed(2)}MB`,
    };
  }
  
  return { valid: true };
}

/**
 * Get audio duration in seconds
 */
export function getAudioDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
    const url = URL.createObjectURL(file);
    
    audio.addEventListener('loadedmetadata', () => {
      URL.revokeObjectURL(url);
      resolve(Math.floor(audio.duration));
    });
    
    audio.addEventListener('error', () => {
      URL.revokeObjectURL(url);
      reject(new Error('Failed to load audio file'));
    });
    
    audio.src = url;
  });
}

/**
 * Format duration from seconds to MM:SS
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get audio file metadata
 */
export async function getAudioMetadata(file: File): Promise<{
  duration: number;
  size: number;
  sizeFormatted: string;
}> {
  const duration = await getAudioDuration(file);
  const size = file.size;
  const sizeFormatted = formatFileSize(size);
  
  return {
    duration,
    size,
    sizeFormatted,
  };
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Create audio preview URL
 */
export function createAudioPreviewUrl(file: File): string {
  return URL.createObjectURL(file);
}

/**
 * Revoke audio preview URL
 */
export function revokeAudioPreviewUrl(url: string): void {
  URL.revokeObjectURL(url);
}
