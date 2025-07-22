// Authentication middleware
export {
  protect,
  authorize,
  authRateLimit,
  requireEmailVerification
} from './auth';

// Error handling middleware
export {
  ErrorResponse,
  errorHandler,
  notFound,
  handleValidationErrors,
  handleRateLimitError
} from './error';

// File upload middleware
export {
  uploadImages,
  uploadAudio,
  uploadDocument,
  handleUploadError,
  optimizeImage,
  validateFileMetadata
} from './upload';

// Validation middleware
export {
  validate,
  commonValidationRules,
  customValidators
} from './validate';

// Logging middleware
export {
  requestLogger,
  performanceMonitor,
  errorLogger,
  logger
} from './logger';

// Security middleware
export {
  rateLimiters,
  securityHeaders,
  corsMiddleware,
  xssProtection,
  requestSizeLimiter,
  validateApiKey,
  validateRequest
} from './security';