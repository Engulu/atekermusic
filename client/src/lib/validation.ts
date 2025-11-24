/**
 * Comprehensive Form Validation Utilities
 * Production-grade validation for Ateker Music Platform
 */

// Email validation with RFC 5322 compliance
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || email.trim().length === 0) {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Please enter a valid email address' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email address is too long' };
  }

  return { valid: true };
}

// Password validation with strength requirements
export function validatePassword(password: string): { valid: boolean; error?: string; strength?: 'weak' | 'medium' | 'strong' } {
  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password is too long (max 128 characters)' };
  }

  // Check password strength
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const strengthScore = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

  if (strengthScore < 2) {
    return { valid: false, error: 'Password must contain at least 2 of: uppercase, lowercase, numbers, special characters', strength: 'weak' };
  }

  const strength = strengthScore === 4 ? 'strong' : strengthScore === 3 ? 'medium' : 'weak';
  return { valid: true, strength };
}

// Phone number validation (Uganda format)
export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  if (!phone || phone.trim().length === 0) {
    return { valid: false, error: 'Phone number is required' };
  }

  // Remove spaces and dashes
  const cleanPhone = phone.replace(/[\s-]/g, '');

  // Uganda phone formats: +256XXXXXXXXX, 256XXXXXXXXX, 0XXXXXXXXX
  const ugandaPhoneRegex = /^(\+?256|0)[37]\d{8}$/;

  if (!ugandaPhoneRegex.test(cleanPhone)) {
    return { valid: false, error: 'Please enter a valid Uganda phone number (e.g., 0712345678 or +256712345678)' };
  }

  return { valid: true };
}

// File validation for uploads
export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export function validateFile(file: File, options: FileValidationOptions = {}): { valid: boolean; error?: string } {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = [],
    allowedExtensions = [],
  } = options;

  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
    return { valid: false, error: `File size exceeds ${maxSizeMB}MB limit` };
  }

  // Check file type
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed` };
  }

  // Check file extension
  if (allowedExtensions.length > 0) {
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !allowedExtensions.includes(extension)) {
      return { valid: false, error: `File extension .${extension} is not allowed. Allowed: ${allowedExtensions.join(', ')}` };
    }
  }

  return { valid: true };
}

// Audio file validation
export function validateAudioFile(file: File): { valid: boolean; error?: string } {
  return validateFile(file, {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'],
    allowedExtensions: ['mp3', 'wav', 'ogg'],
  });
}

// Image file validation
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  return validateFile(file, {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
  });
}

// Text input validation
export function validateTextInput(
  text: string,
  options: { minLength?: number; maxLength?: number; required?: boolean; label?: string } = {}
): { valid: boolean; error?: string } {
  const { minLength = 0, maxLength = 10000, required = true, label = 'This field' } = options;

  if (required && (!text || text.trim().length === 0)) {
    return { valid: false, error: `${label} is required` };
  }

  if (text && text.length < minLength) {
    return { valid: false, error: `${label} must be at least ${minLength} characters` };
  }

  if (text && text.length > maxLength) {
    return { valid: false, error: `${label} must not exceed ${maxLength} characters` };
  }

  return { valid: true };
}

// URL validation
export function validateURL(url: string, required: boolean = false): { valid: boolean; error?: string } {
  if (!required && (!url || url.trim().length === 0)) {
    return { valid: true };
  }

  if (required && (!url || url.trim().length === 0)) {
    return { valid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { valid: true };
  } catch {
    return { valid: false, error: 'Please enter a valid URL (e.g., https://example.com)' };
  }
}

// Sanitize text input (prevent XSS)
export function sanitizeText(text: string): string {
  if (!text) return '';
  
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

// Validate song title
export function validateSongTitle(title: string): { valid: boolean; error?: string } {
  return validateTextInput(title, {
    minLength: 1,
    maxLength: 200,
    required: true,
    label: 'Song title',
  });
}

// Validate artist name
export function validateArtistName(name: string): { valid: boolean; error?: string } {
  return validateTextInput(name, {
    minLength: 2,
    maxLength: 100,
    required: true,
    label: 'Artist name',
  });
}

// Validate biography
export function validateBiography(bio: string): { valid: boolean; error?: string } {
  return validateTextInput(bio, {
    minLength: 10,
    maxLength: 5000,
    required: false,
    label: 'Biography',
  });
}

// Validate lyrics
export function validateLyrics(lyrics: string): { valid: boolean; error?: string } {
  return validateTextInput(lyrics, {
    minLength: 0,
    maxLength: 50000,
    required: false,
    label: 'Lyrics',
  });
}

// Validate price (for premium songs)
export function validatePrice(price: number): { valid: boolean; error?: string } {
  if (price < 0) {
    return { valid: false, error: 'Price cannot be negative' };
  }

  if (price > 1000000) {
    return { valid: false, error: 'Price is too high (max UGX 1,000,000)' };
  }

  return { valid: true };
}

// Validate Mobile Money number (Uganda)
export function validateMobileMoneyNumber(number: string): { valid: boolean; error?: string } {
  if (!number || number.trim().length === 0) {
    return { valid: false, error: 'Mobile Money number is required' };
  }

  const cleanNumber = number.replace(/[\s-]/g, '');
  
  // Uganda Mobile Money: MTN (077, 078, 076), Airtel (075, 070, 074)
  const mobileMoneyRegex = /^(\+?256|0)(77|78|76|75|70|74)\d{7}$/;

  if (!mobileMoneyRegex.test(cleanNumber)) {
    return { valid: false, error: 'Please enter a valid Mobile Money number' };
  }

  return { valid: true };
}

// Check for profanity/inappropriate content (basic filter)
const profanityList = ['badword1', 'badword2']; // Add actual profanity list

export function containsProfanity(text: string): boolean {
  if (!text) return false;
  
  const lowerText = text.toLowerCase();
  return profanityList.some(word => lowerText.includes(word));
}

// Validate form data object
export function validateFormData<T extends Record<string, any>>(
  data: T,
  validators: { [K in keyof T]?: (value: T[K]) => { valid: boolean; error?: string } }
): { valid: boolean; errors: Partial<Record<keyof T, string>> } {
  const errors: Partial<Record<keyof T, string>> = {};
  let isValid = true;

  for (const key in validators) {
    const validator = validators[key];
    if (validator) {
      const result = validator(data[key]);
      if (!result.valid) {
        errors[key] = result.error;
        isValid = false;
      }
    }
  }

  return { valid: isValid, errors };
}
