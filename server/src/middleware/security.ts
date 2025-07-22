import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import { ErrorResponse } from './error';

// Configure CORS options
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('Not allowed by CORS'), false);
    }
    
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

// Configure rate limiting options
const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, error: message },
    standardHeaders: true,
    legacyHeaders: false
  });
};

// Rate limiters for different routes
export const rateLimiters = {
  // General API rate limit
  api: createRateLimiter(
    15 * 60 * 1000, // 15 minutes
    100, // 100 requests
    'Too many requests from this IP, please try again after 15 minutes'
  ),

  // Auth routes rate limit
  auth: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    5, // 5 requests
    'Too many authentication attempts, please try again after an hour'
  ),

  // Contact form rate limit
  contact: createRateLimiter(
    60 * 60 * 1000, // 1 hour
    10, // 10 requests
    'Too many contact form submissions, please try again after an hour'
  )
};

// Security headers middleware using helmet
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https:'],
      fontSrc: ["'self'", 'https:'],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'", 'https:'],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
});

// CORS middleware
export const corsMiddleware = cors(corsOptions);

// XSS protection middleware
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  // Sanitize request body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].replace(/[<>]/g, '');
      }
    });
  }

  // Sanitize request query
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = (req.query[key] as string).replace(/[<>]/g, '');
      }
    });
  }

  next();
};

// Request size limiter middleware
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.get('content-length') || '0', 10);
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB

  if (contentLength > MAX_SIZE) {
    return next(new ErrorResponse('Request entity too large', 413));
  }

  next();
};

// API key validation middleware
export const validateApiKey = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.get('X-API-Key');

  if (!apiKey || apiKey !== process.env.API_KEY) {
    return next(new ErrorResponse('Invalid API key', 401));
  }

  next();
};

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  // Validate Content-Type
  if (req.method !== 'GET' && !req.is('application/json')) {
    return next(new ErrorResponse('Content-Type must be application/json', 415));
  }

  // Validate Accept header
  const acceptHeader = req.get('Accept');
  if (acceptHeader && acceptHeader !== '*/*' && !acceptHeader.includes('application/json')) {
    return next(new ErrorResponse('Not Acceptable - API only supports application/json', 406));
  }

  next();
};