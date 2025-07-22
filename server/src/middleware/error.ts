import { Request, Response, NextFunction } from 'express';
import { MongoError } from 'mongodb';
import * as Sentry from '@sentry/node';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any[];
  value?: any;
  path?: string;
  keyValue?: any;
}

export class ErrorResponse extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  let error = { ...err };
  error.message = err.message;

  // Log error to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error(err);
  }

  // Log error to Sentry in production
  if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
    Sentry.captureException(err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key
  if ((err as MongoError).code === 11000) {
    const field = Object.keys(err.keyValue!)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value`;
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors!).map(val => val.message);
    error = new ErrorResponse(message.join(', '), 400);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = new ErrorResponse(message, 401);
  }

  // Default error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

// Handle 404 errors
export const notFound = (req: Request, res: Response, next: NextFunction) => {
  const error = new ErrorResponse(`Not Found - ${req.originalUrl}`, 404);
  next(error);
};

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = req.validationErrors();
  
  if (errors) {
    const errorMessages = errors.map((err: any) => err.msg);
    return res.status(400).json({
      success: false,
      error: errorMessages
    });
  }

  next();
};

// Rate limit error handler
export const handleRateLimitError = (req: Request, res: Response) => {
  res.status(429).json({
    success: false,
    error: 'Too many requests, please try again later.'
  });
};