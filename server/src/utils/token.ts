import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config';

interface TokenPayload {
  id: string;
  [key: string]: any;
}

interface TokenResponse {
  token: string;
  refreshToken?: string;
}

// Generate access token
export const generateToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn
  });
};

// Generate refresh token
export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn
  });
};

// Verify access token
export const verifyToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, jwtConfig.secret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Verify refresh token
export const verifyRefreshToken = (token: string): TokenPayload => {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret) as TokenPayload;
  } catch (error) {
    throw new Error('Invalid refresh token');
  }
};

// Generate both access and refresh tokens
export const generateAuthTokens = (payload: TokenPayload): TokenResponse => {
  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    token,
    refreshToken
  };
};

// Extract token from authorization header
export const extractTokenFromHeader = (authHeader: string): string => {
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header format');
  }

  return authHeader.split(' ')[1];
};

// Decode token without verification
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    return jwt.decode(token) as TokenPayload;
  } catch (error) {
    return null;
  }
};

// Check if token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwt.decode(token) as { exp: number };
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

// Get token expiration time
export const getTokenExpiration = (token: string): Date | null => {
  try {
    const decoded = jwt.decode(token) as { exp: number };
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
};

// Generate temporary token (for email verification, password reset, etc.)
export const generateTempToken = (payload: TokenPayload, expiresIn: string): string => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn });
};