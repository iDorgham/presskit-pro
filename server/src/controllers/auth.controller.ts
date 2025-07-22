import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { ErrorResponse } from '../middleware/error';
import {
  generateAuthTokens,
  generateTempToken,
  verifyToken,
  sendEmail,
  emailTemplates
} from '../utils';
import { cache } from '../utils/cache';
import { payment } from '../utils/payment';

class AuthController {
  // Register user
  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, username, name } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ $or: [{ email }, { username }] });
      if (existingUser) {
        throw new ErrorResponse(
          `User already exists with this ${existingUser.email === email ? 'email' : 'username'}`,
          400
        );
      }

      // Create user
      const user = await User.create({
        email,
        password,
        username,
        name,
        tier: 'free'
      });

      // Create Stripe customer
      const customerId = await payment.createCustomer(email, name);
      user.stripeCustomerId = customerId;
      await user.save();

      // Generate verification token
      const verificationToken = generateTempToken({ id: user._id }, '24h');

      // Send verification email
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
      await sendEmail(
        email,
        ...Object.values(emailTemplates.welcome(name || username, verificationUrl))
      );

      // Generate auth tokens
      const { token, refreshToken } = generateAuthTokens({ id: user._id });

      res.status(201).json({
        success: true,
        data: {
          user: user.toPublicJSON(),
          token,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Login user
  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Check if user exists
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new ErrorResponse('Invalid credentials', 401);
      }

      // Check if password matches
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new ErrorResponse('Invalid credentials', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new ErrorResponse('Your account has been deactivated', 401);
      }

      // Generate auth tokens
      const { token, refreshToken } = generateAuthTokens({ id: user._id });

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      res.status(200).json({
        success: true,
        data: {
          user: user.toPublicJSON(),
          token,
          refreshToken
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // Logout user
  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        // Add token to blacklist
        await cache.set(`blacklist_${token}`, 'true', 86400); // 24 hours
      }

      res.status(200).json({
        success: true,
        data: null,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Get current user
  getMe = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        throw new ErrorResponse('User not found', 404);
      }

      res.status(200).json({
        success: true,
        data: user.toPublicJSON()
      });
    } catch (error) {
      next(error);
    }
  };

  // Update user details
  updateDetails = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, username } = req.body;

      // Check if username is taken
      if (username) {
        const existingUser = await User.findOne({ username, _id: { $ne: req.user.id } });
        if (existingUser) {
          throw new ErrorResponse('Username is already taken', 400);
        }
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, username },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        data: user?.toPublicJSON()
      });
    } catch (error) {
      next(error);
    }
  };

  // Update password
  updatePassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;

      const user = await User.findById(req.user.id).select('+password');
      if (!user) {
        throw new ErrorResponse('User not found', 404);
      }

      // Check current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new ErrorResponse('Current password is incorrect', 401);
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Forgot password
  forgotPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        throw new ErrorResponse('User not found', 404);
      }

      // Generate reset token
      const resetToken = generateTempToken({ id: user._id }, '1h');

      // Send reset email
      const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
      await sendEmail(
        email,
        ...Object.values(emailTemplates.passwordReset(resetUrl))
      );

      res.status(200).json({
        success: true,
        message: 'Password reset email sent'
      });
    } catch (error) {
      next(error);
    }
  };

  // Reset password
  resetPassword = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, password } = req.body;

      // Verify token
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ErrorResponse('Invalid token', 400);
      }

      user.password = password;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      next(error);
    }
  };

  // Verify email
  verifyEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token } = req.body;

      // Verify token
      const decoded = verifyToken(token);

      const user = await User.findById(decoded.id);
      if (!user) {
        throw new ErrorResponse('Invalid token', 400);
      }

      user.settings.emailVerified = true;
      await user.save();

      res.status(200).json({
        success: true,
        message: 'Email verified successfully'
      });
    } catch (error) {
      next(error);
    }
  };

  // Resend verification email
  resendVerificationEmail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        throw new ErrorResponse('User not found', 404);
      }

      if (user.settings.emailVerified) {
        throw new ErrorResponse('Email already verified', 400);
      }

      // Generate verification token
      const verificationToken = generateTempToken({ id: user._id }, '24h');

      // Send verification email
      const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
      await sendEmail(
        user.email,
        ...Object.values(emailTemplates.welcome(user.name || user.username, verificationUrl))
      );

      res.status(200).json({
        success: true,
        message: 'Verification email sent'
      });
    } catch (error) {
      next(error);
    }
  };
}

export default new AuthController();