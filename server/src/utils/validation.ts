import { Request } from 'express';
import { validationResult, ValidationChain, body, param, query } from 'express-validator';
import { ErrorResponse } from '../middleware/error';

// Custom validation rules
export const validationRules = {
  // User validation rules
  user: {
    create: [
      body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
      body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[!@#$%^&*(),.?":{}|<>]/)
        .withMessage('Password must contain at least one special character'),
      body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    ],
    login: [
      body('email').trim().isEmail().withMessage('Please enter a valid email address'),
      body('password').notEmpty().withMessage('Password is required')
    ],
    update: [
      body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address')
        .normalizeEmail(),
      body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_-]+$/)
        .withMessage('Username can only contain letters, numbers, underscores, and hyphens')
    ]
  },

  // EPK validation rules
  epk: {
    create: [
      body('title')
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
      body('description')
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage('Description cannot exceed 5000 characters'),
      body('socialLinks.*')
        .optional()
        .isURL()
        .withMessage('Please enter valid social media URLs'),
      body('contactEmail')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please enter a valid contact email address')
    ],
    update: [
      param('id').isMongoId().withMessage('Invalid EPK ID'),
      body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 100 })
        .withMessage('Title must be between 3 and 100 characters'),
      body('description')
        .optional()
        .trim()
        .isLength({ max: 5000 })
        .withMessage('Description cannot exceed 5000 characters')
    ]
  },

  // Contact form validation rules
  contact: {
    submit: [
      body('name')
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
      body('email')
        .trim()
        .isEmail()
        .withMessage('Please enter a valid email address'),
      body('subject')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Subject must be between 3 and 200 characters'),
      body('message')
        .trim()
        .isLength({ min: 10, max: 5000 })
        .withMessage('Message must be between 10 and 5000 characters')
    ]
  },

  // Common validation rules
  common: {
    pagination: [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
      query('sort')
        .optional()
        .isString()
        .withMessage('Sort must be a string')
    ],
    mongoId: [
      param('id').isMongoId().withMessage('Invalid ID format')
    ]
  }
};

// Validate request against rules
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorResponse(errors.array()[0].msg, 400);
    }
  };
};

// Sanitize request data
export const sanitize = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  const sanitized: any = Array.isArray(data) ? [] : {};

  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      // Remove HTML tags and trim
      sanitized[key] = value.replace(/<[^>]*>/g, '').trim();
    } else if (typeof value === 'object' && value !== null) {
      // Recursively sanitize nested objects and arrays
      sanitized[key] = sanitize(value);
    } else {
      // Keep other types as is
      sanitized[key] = value;
    }
  }

  return sanitized;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password: string): boolean => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return (
    password.length >= minLength &&
    hasUpperCase &&
    hasLowerCase &&
    hasNumbers &&
    hasSpecialChar
  );
};

// Validate URL format
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};