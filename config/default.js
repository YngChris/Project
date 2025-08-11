/**
 * Default configuration for MedAlert API
 */
module.exports = {
  // Server configuration
  server: {
    port: process.env.PORT || 5000,
    env: process.env.NODE_ENV || 'development',
  },

  // Database configuration
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/medalert',
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    algorithm: 'HS256',
  },

  // Password hashing configuration
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
  },

  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  // CORS configuration
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },

  // Validation rules
  validation: {
    password: {
      minLength: 6,
      requireUppercase: false,
      requireLowercase: false,
      requireNumbers: false,
      requireSpecialChars: false,
    },
    email: {
      requireValidFormat: true,
    },
  },

  // API response messages
  messages: {
    success: {
      userRegistered: 'User registered successfully',
      userLoggedIn: 'User logged in successfully',
      userLoggedOut: 'User logged out successfully',
      profileUpdated: 'Profile updated successfully',
      passwordChanged: 'Password changed successfully',
      medicationCreated: 'Medication created successfully',
      medicationUpdated: 'Medication updated successfully',
      medicationDeleted: 'Medication deleted successfully',
      alertCreated: 'Alert created successfully',
      alertUpdated: 'Alert updated successfully',
      alertDeleted: 'Alert deleted successfully',
      medicationTaken: 'Medication marked as taken',
      reportCreated: 'Report created successfully',
      discussionCreated: 'Discussion created successfully',
      replyAdded: 'Reply added successfully',
      locationCreated: 'Location created successfully',
    },
    error: {
      invalidCredentials: 'Invalid email or password',
      userNotFound: 'User not found',
      medicationNotFound: 'Medication not found',
      alertNotFound: 'Alert not found',
      discussionNotFound: 'Discussion not found',
      locationNotFound: 'Location not found',
      unauthorized: 'Access denied. Authentication required.',
      forbidden: 'Access forbidden. Insufficient permissions.',
      validationError: 'Validation error',
      serverError: 'Internal server error',
    },
  },
}; 