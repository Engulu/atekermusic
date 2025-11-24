/**
 * Security Utilities for Ateker Music Platform
 * Production-grade security measures
 */

// Rate limiting for client-side operations
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
}

class RateLimiter {
  private attempts: Map<string, { count: number; resetTime: number }> = new Map();

  check(key: string, config: RateLimitConfig): { allowed: boolean; remainingAttempts: number; resetTime?: number } {
    const now = Date.now();
    const record = this.attempts.get(key);

    // Clean up expired records
    if (record && now > record.resetTime) {
      this.attempts.delete(key);
    }

    const currentRecord = this.attempts.get(key);

    if (!currentRecord) {
      // First attempt
      this.attempts.set(key, {
        count: 1,
        resetTime: now + config.windowMs,
      });
      return { allowed: true, remainingAttempts: config.maxAttempts - 1 };
    }

    if (currentRecord.count >= config.maxAttempts) {
      return {
        allowed: false,
        remainingAttempts: 0,
        resetTime: currentRecord.resetTime,
      };
    }

    // Increment attempt count
    currentRecord.count++;
    return {
      allowed: true,
      remainingAttempts: config.maxAttempts - currentRecord.count,
    };
  }

  reset(key: string): void {
    this.attempts.delete(key);
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter();

// Rate limit configurations
export const RATE_LIMITS = {
  login: { maxAttempts: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  register: { maxAttempts: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  upload: { maxAttempts: 10, windowMs: 60 * 60 * 1000 }, // 10 uploads per hour
  download: { maxAttempts: 100, windowMs: 60 * 60 * 1000 }, // 100 downloads per hour
  api: { maxAttempts: 100, windowMs: 60 * 1000 }, // 100 API calls per minute
};

// Content Security Policy helpers
export function getCSPNonce(): string {
  return Math.random().toString(36).substring(2, 15);
}

// Secure storage wrapper
export const secureStorage = {
  setItem(key: string, value: string): void {
    try {
      // Add timestamp for expiration checking
      const item = {
        value,
        timestamp: Date.now(),
      };
      localStorage.setItem(key, JSON.stringify(item));
    } catch (error) {
      console.error('Storage error:', error);
    }
  },

  getItem(key: string, maxAge?: number): string | null {
    try {
      const itemStr = localStorage.getItem(key);
      if (!itemStr) return null;

      const item = JSON.parse(itemStr);
      
      // Check expiration if maxAge is provided
      if (maxAge && Date.now() - item.timestamp > maxAge) {
        localStorage.removeItem(key);
        return null;
      }

      return item.value;
    } catch (error) {
      console.error('Storage retrieval error:', error);
      return null;
    }
  },

  removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Storage removal error:', error);
    }
  },

  clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  },
};

// File security checks
export function isValidFileExtension(filename: string, allowedExtensions: string[]): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

export function hasDoubleExtension(filename: string): boolean {
  // Check for double extensions like .jpg.exe
  const parts = filename.split('.');
  return parts.length > 2;
}

export function containsSuspiciousPatterns(filename: string): boolean {
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.scr$/i,
    /\.vbs$/i,
    /\.js$/i,
    /\.jar$/i,
    /<script/i,
    /javascript:/i,
    /on\w+=/i, // Event handlers like onclick=
  ];

  return suspiciousPatterns.some(pattern => pattern.test(filename));
}

// Sanitize filename
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/\.{2,}/g, '.') // Replace multiple dots with single dot
    .substring(0, 255); // Limit length
}

// Check file MIME type
export async function verifyFileMimeType(file: File, expectedTypes: string[]): Promise<boolean> {
  try {
    // Read first few bytes to check magic numbers
    const buffer = await file.slice(0, 4).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    
    // Check magic numbers for common file types
    const signatures: { [key: string]: number[][] } = {
      'image/jpeg': [[0xFF, 0xD8, 0xFF]],
      'image/png': [[0x89, 0x50, 0x4E, 0x47]],
      'audio/mpeg': [[0xFF, 0xFB], [0xFF, 0xF3], [0xFF, 0xF2], [0x49, 0x44, 0x33]], // MP3
      'audio/wav': [[0x52, 0x49, 0x46, 0x46]], // WAV
    };

    for (const type of expectedTypes) {
      const typeSignatures = signatures[type];
      if (typeSignatures) {
        for (const signature of typeSignatures) {
          let matches = true;
          for (let i = 0; i < signature.length; i++) {
            if (bytes[i] !== signature[i]) {
              matches = false;
              break;
            }
          }
          if (matches) return true;
        }
      }
    }

    return false;
  } catch (error) {
    console.error('MIME type verification error:', error);
    return false;
  }
}

// Prevent clickjacking
export function preventClickjacking(): void {
  if (window.self !== window.top) {
    // Page is in iframe, redirect to top
    window.top!.location = window.self.location;
  }
}

// Secure random string generator
export function generateSecureRandomString(length: number = 32): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

// Hash string (for client-side comparison, not for passwords)
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Detect suspicious user behavior
export class SecurityMonitor {
  private static rapidClicks = 0;
  private static lastClickTime = 0;
  private static suspiciousActivityDetected = false;

  static trackClick(): void {
    const now = Date.now();
    if (now - this.lastClickTime < 100) {
      this.rapidClicks++;
      if (this.rapidClicks > 20) {
        this.suspiciousActivityDetected = true;
        console.warn('Suspicious rapid clicking detected');
      }
    } else {
      this.rapidClicks = 0;
    }
    this.lastClickTime = now;
  }

  static isSuspicious(): boolean {
    return this.suspiciousActivityDetected;
  }

  static reset(): void {
    this.rapidClicks = 0;
    this.suspiciousActivityDetected = false;
  }
}

// Input sanitization for display
export function sanitizeForDisplay(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

// Validate redirect URLs (prevent open redirect)
export function isValidRedirectURL(url: string, allowedDomains: string[]): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    
    // Only allow same origin or whitelisted domains
    if (urlObj.origin === window.location.origin) {
      return true;
    }

    return allowedDomains.some(domain => urlObj.hostname.endsWith(domain));
  } catch {
    return false;
  }
}

// Session timeout management
export class SessionManager {
  private static readonly TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
  private static timeoutId: number | null = null;
  private static lastActivity = Date.now();

  static startMonitoring(onTimeout: () => void): void {
    this.resetTimeout(onTimeout);

    // Track user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, () => {
        this.lastActivity = Date.now();
        this.resetTimeout(onTimeout);
      });
    });
  }

  private static resetTimeout(onTimeout: () => void): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }

    this.timeoutId = window.setTimeout(() => {
      onTimeout();
    }, this.TIMEOUT_MS);
  }

  static getInactiveTime(): number {
    return Date.now() - this.lastActivity;
  }
}

// Prevent console tampering
export function protectConsole(): void {
  if (import.meta.env.PROD) {
    const noop = () => {};
    console.log = noop;
    console.warn = noop;
    console.error = noop;
  }
}

// Export security headers recommendations
export const SECURITY_HEADERS = {
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://*.supabase.co https://api-inference.huggingface.co;",
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
};
