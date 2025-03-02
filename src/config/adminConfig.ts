export const adminConfig = {
  roles: {
    admin: {
      level: 1,
      permissions: [
        'manage_users',
        'manage_content',
        'view_analytics',
        'manage_settings',
        'approve_artists'
      ]
    }
  },
  securitySettings: {
    maxLoginAttempts: 5,
    lockoutDuration: 30, // minutes
    sessionTimeout: 120 // minutes
  }
}; 