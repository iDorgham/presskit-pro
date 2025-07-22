import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import * as Sentry from '@sentry/node';

// Configure Winston logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Write all logs to console
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    // Write production logs to a file
    ...(process.env.NODE_ENV === 'production' ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    ] : [])
  ],
  exitOnError: false
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  // Log request
  logger.info('Incoming request', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    userId: req.user?.id || 'anonymous'
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';

    logger[logLevel]('Request completed', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id || 'anonymous'
    });

    // Send error data to Sentry in production
    if (process.env.NODE_ENV === 'production' && res.statusCode >= 400) {
      Sentry.withScope((scope) => {
        scope.setExtra('duration', duration);
        scope.setExtra('userId', req.user?.id || 'anonymous');
        Sentry.captureMessage(`HTTP ${res.statusCode} ${req.method} ${req.url}`);
      });
    }
  });

  next();
};

// Performance monitoring middleware
export const performanceMonitor = (req: Request, res: Response, next: NextFunction) => {
  const start = process.hrtime();

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const duration = seconds * 1000 + nanoseconds / 1000000; // Convert to milliseconds

    // Log slow requests (over 1000ms)
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        userId: req.user?.id || 'anonymous'
      });

      // Send slow request data to Sentry in production
      if (process.env.NODE_ENV === 'production') {
        Sentry.withScope((scope) => {
          scope.setExtra('duration', duration);
          scope.setExtra('userId', req.user?.id || 'anonymous');
          Sentry.captureMessage(`Slow Request: ${req.method} ${req.url}`);
        });
      }
    }
  });

  next();
};

// Error logging middleware
export const errorLogger = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error('Error occurred', {
    error: {
      message: err.message,
      stack: err.stack,
      status: err.statusCode || 500
    },
    request: {
      method: req.method,
      url: req.url,
      userId: req.user?.id || 'anonymous',
      body: req.body
    }
  });

  // Send error to Sentry in production
  if (process.env.NODE_ENV === 'production') {
    Sentry.withScope((scope) => {
      scope.setExtra('userId', req.user?.id || 'anonymous');
      scope.setExtra('requestBody', req.body);
      Sentry.captureException(err);
    });
  }

  next(err);
};

// Export logger instance for use in other parts of the application
export { logger };