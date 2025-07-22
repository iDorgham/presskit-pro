import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export interface AuthenticatedRequest extends Request {
  user: any;
}

// Protect routes
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Check for token in Authorization header
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;

      // Get user from token
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found',
        });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: 'User account is deactivated',
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }
  } catch (error) {
    next(error);
  }
};

// Grant access to specific roles
export const authorize = (...tiers: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route',
      });
    }

    if (!tiers.includes(req.user.tier)) {
      return res.status(403).json({
        success: false,
        error: `User tier ${req.user.tier} is not authorized to access this route`,
      });
    }

    next();
  };
};

// Rate limiting middleware for auth routes
export const authRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Implementation will be added when we set up Redis for rate limiting
  next();
};

// Verify email middleware
export const requireEmailVerification = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Not authorized to access this route',
    });
  }

  if (!req.user.settings.emailVerified) {
    return res.status(403).json({
      success: false,
      error: 'Please verify your email address to access this route',
    });
  }

  next();
};