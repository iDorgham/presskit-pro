import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config();

// Server configuration
export const serverConfig = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  apiPrefix: '/api/v1',
  corsOrigin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  uploadDir: path.join(__dirname, '../../uploads')
};

// Database configuration
export const dbConfig = {
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/presskit-pro',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
    maxPoolSize: 10
  }
};

// JWT configuration
export const jwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key',
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d'
};

// Email configuration
export const emailConfig = {
  from: process.env.EMAIL_FROM || 'noreply@presskitpro.com',
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  }
};

// Cloudinary configuration
export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
  folder: 'presskit-pro'
};

// Stripe configuration
export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  currency: 'usd',
  paymentMethods: ['card'],
  subscriptionPlans: {
    basic: process.env.STRIPE_BASIC_PLAN_ID,
    pro: process.env.STRIPE_PRO_PLAN_ID,
    enterprise: process.env.STRIPE_ENTERPRISE_PLAN_ID
  }
};

// Sentry configuration
export const sentryConfig = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
};

// Redis configuration
export const redisConfig = {
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  prefix: 'presskit-pro:',
  ttl: 86400 // 24 hours
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};

// File upload configuration
export const uploadConfig = {
  maxFileSize: 25 * 1024 * 1024, // 25MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/heic'],
  allowedAudioTypes: ['audio/mpeg', 'audio/wav', 'audio/flac'],
  allowedDocTypes: ['application/pdf'],
  maxImageCount: 10,
  imageQuality: 80
};

// Analytics configuration
export const analyticsConfig = {
  enabled: process.env.ENABLE_ANALYTICS === 'true',
  provider: process.env.ANALYTICS_PROVIDER || 'internal',
  googleAnalyticsId: process.env.GA_TRACKING_ID
};

// Cache configuration
export const cacheConfig = {
  enabled: process.env.ENABLE_CACHE === 'true',
  ttl: 60 * 60, // 1 hour
  excludedRoutes: ['/api/v1/auth', '/api/v1/webhooks']
};

// Logging configuration
export const loggingConfig = {
  level: process.env.LOG_LEVEL || 'info',
  file: {
    enabled: process.env.FILE_LOGGING_ENABLED === 'true',
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    maxSize: '20m',
    maxFiles: '14d'
  }
};