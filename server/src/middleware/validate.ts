import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ErrorResponse } from './error';

// Middleware to validate request data
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Execute all validations
    await Promise.all(validations.map(validation => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg);
      return next(new ErrorResponse(errorMessages.join(', '), 400));
    }

    next();
  };
};

// Common validation rules
export const commonValidationRules = {
  // User validation rules
  email: {
    notEmpty: 'Email is required',
    isEmail: 'Please enter a valid email address',
    normalizeEmail: true
  },
  password: {
    notEmpty: 'Password is required',
    minLength: 8,
    maxLength: 50,
    hasUppercase: 'Password must contain at least one uppercase letter',
    hasLowercase: 'Password must contain at least one lowercase letter',
    hasNumber: 'Password must contain at least one number',
    hasSpecialChar: 'Password must contain at least one special character'
  },
  username: {
    notEmpty: 'Username is required',
    minLength: 3,
    maxLength: 30,
    pattern: '^[a-zA-Z0-9_-]+$',
    patternMessage: 'Username can only contain letters, numbers, underscores, and hyphens'
  },

  // EPK validation rules
  title: {
    notEmpty: 'Title is required',
    minLength: 3,
    maxLength: 100
  },
  description: {
    optional: true,
    maxLength: 5000
  },
  url: {
    optional: true,
    isURL: 'Please enter a valid URL'
  },
  socialMedia: {
    optional: true,
    isURL: 'Please enter a valid social media URL'
  },

  // Contact form validation rules
  name: {
    notEmpty: 'Name is required',
    minLength: 2,
    maxLength: 100
  },
  subject: {
    notEmpty: 'Subject is required',
    minLength: 3,
    maxLength: 200
  },
  message: {
    notEmpty: 'Message is required',
    minLength: 10,
    maxLength: 5000
  },

  // Common validation rules
  id: {
    notEmpty: 'ID is required',
    isMongoId: 'Invalid ID format'
  },
  date: {
    optional: true,
    isISO8601: 'Please enter a valid date'
  },
  phone: {
    optional: true,
    isMobilePhone: 'Please enter a valid phone number'
  }
};

// Custom validation middleware
export const customValidators = {
  // Check if value exists in database
  isUnique: (model: any, field: string) => {
    return async (value: string) => {
      const existing = await model.findOne({ [field]: value });
      if (existing) {
        throw new Error(`${field} already exists`);
      }
      return true;
    };
  },

  // Check if value exists in database (excluding current record)
  isUniqueExcept: (model: any, field: string, exceptId: string) => {
    return async (value: string) => {
      const existing = await model.findOne({
        [field]: value,
        _id: { $ne: exceptId }
      });
      if (existing) {
        throw new Error(`${field} already exists`);
      }
      return true;
    };
  },

  // Check if password meets complexity requirements
  isStrongPassword: () => {
    return (value: string) => {
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumbers = /\d/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      if (!hasUpperCase) throw new Error('Password must contain at least one uppercase letter');
      if (!hasLowerCase) throw new Error('Password must contain at least one lowercase letter');
      if (!hasNumbers) throw new Error('Password must contain at least one number');
      if (!hasSpecialChar) throw new Error('Password must contain at least one special character');

      return true;
    };
  },

  // Check if value is within allowed values
  isInEnum: (allowedValues: string[], fieldName: string) => {
    return (value: string) => {
      if (!allowedValues.includes(value)) {
        throw new Error(`Invalid ${fieldName}. Allowed values: ${allowedValues.join(', ')}`);
      }
      return true;
    };
  }
};