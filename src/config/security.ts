export const securityConfig = {
  // Password requirements
  passwordRequirements: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true
  },

  // Session management
  session: {
    timeout: 30 * 60 * 1000, // 30 minutes
    maxConcurrentSessions: 3
  },

  // Rate limiting
  rateLimits: {
    login: {
      attempts: 5,
      window: 15 * 60 * 1000 // 15 minutes
    },
    api: {
      requests: 100,
      window: 60 * 1000 // 1 minute
    }
  },

  // Admin permissions
  adminPermissions: [
    'manage_users',
    'manage_content',
    'view_analytics',
    'manage_settings',
    'manage_roles',
    'manage_security'
  ],

  // Security headers
  headers: {
    'Content-Security-Policy': "default-src 'self'",
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
}; 