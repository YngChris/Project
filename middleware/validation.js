const { validationResult } = require('express-validator');
const config = require('../config/default');

/**
 * Handle validation errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: config.messages.error.validationError,
      errors: errorMessages
    });
  }
  
  next();
};

/**
 * Sanitize and validate user registration data
 */
const validateRegistration = [
  require('express-validator').body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  require('express-validator').body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  require('express-validator').body('password')
    .isLength({ min: config.validation.password.minLength })
    .withMessage(`Password must be at least ${config.validation.password.minLength} characters`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  handleValidationErrors
];

/**
 * Sanitize and validate user login data
 */
const validateLogin = [
  require('express-validator').body('email')
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  require('express-validator').body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

/**
 * Sanitize and validate profile update data
 */
const validateProfileUpdate = [
  require('express-validator').body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Name can only contain letters and spaces'),
  
  require('express-validator').body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

/**
 * Sanitize and validate password change data
 */
const validatePasswordChange = [
  require('express-validator').body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  require('express-validator').body('newPassword')
    .isLength({ min: config.validation.password.minLength })
    .withMessage(`New password must be at least ${config.validation.password.minLength} characters`)
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  
  require('express-validator').body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) {
        throw new Error('Password confirmation does not match new password');
      }
      return true;
    }),
  
  handleValidationErrors
];

/**
 * Sanitize and validate medication data
 */
const validateMedication = [
  require('express-validator').body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Medication name must be between 1 and 100 characters'),
  
  require('express-validator').body('dosage')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Dosage must be between 1 and 50 characters'),
  
  require('express-validator').body('frequency')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Frequency must be between 1 and 100 characters'),
  
  require('express-validator').body('instructions')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Instructions cannot exceed 500 characters'),
  
  require('express-validator').body('startDate')
    .optional()
    .isISO8601()
    .withMessage('Start date must be a valid date'),
  
  require('express-validator').body('endDate')
    .optional()
    .isISO8601()
    .withMessage('End date must be a valid date'),
  
  handleValidationErrors
];

/**
 * Sanitize and validate alert data
 */
const validateAlert = [
  require('express-validator').body('medicationId')
    .isMongoId()
    .withMessage('Valid medication ID is required'),
  
  require('express-validator').body('time')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  
  require('express-validator').body('frequency')
    .isIn(['daily', 'weekly', 'monthly', 'custom'])
    .withMessage('Frequency must be daily, weekly, monthly, or custom'),
  
  require('express-validator').body('message')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Message cannot exceed 200 characters'),
  
  handleValidationErrors
];

/**
 * Sanitize and validate report data
 */
const validateReport = [
  require('express-validator').body('medicationId')
    .isMongoId()
    .withMessage('Valid medication ID is required'),
  
  require('express-validator').body('taken')
    .isBoolean()
    .withMessage('Taken must be a boolean value'),
  
  require('express-validator').body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date'),
  
  require('express-validator').body('notes')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Notes cannot exceed 500 characters'),
  
  handleValidationErrors
];

/**
 * Sanitize and validate discussion data
 */
const validateDiscussion = [
  require('express-validator').body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  require('express-validator').body('content')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Content must be between 10 and 5000 characters'),
  
  require('express-validator').body('category')
    .optional()
    .isIn(['general', 'medication', 'side-effects', 'lifestyle', 'support', 'tips', 'questions'])
    .withMessage('Invalid category'),
  
  require('express-validator').body('tags')
    .optional()
    .isArray({ max: 10 })
    .withMessage('Tags must be an array with maximum 10 items'),
  
  handleValidationErrors
];

/**
 * Sanitize and validate location data
 */
const validateLocation = [
  require('express-validator').body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Location name must be between 1 and 200 characters'),
  
  require('express-validator').body('type')
    .isIn(['pharmacy', 'hospital', 'clinic', 'doctor-office', 'urgent-care', 'specialist', 'other'])
    .withMessage('Invalid location type'),
  
  require('express-validator').body('address.street')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Street address must be between 1 and 200 characters'),
  
  require('express-validator').body('address.city')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('City must be between 1 and 100 characters'),
  
  require('express-validator').body('address.state')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('State must be between 1 and 50 characters'),
  
  require('express-validator').body('address.zipCode')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('ZIP code must be between 1 and 20 characters'),
  
  require('express-validator').body('phone')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Phone number cannot exceed 20 characters'),
  
  require('express-validator').body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateMedication,
  validateAlert,
  validateReport,
  validateDiscussion,
  validateLocation,
}; 