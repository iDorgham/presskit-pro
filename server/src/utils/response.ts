import { Response } from 'express';

// Interface for API response
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

// Success response helper
export const successResponse = <T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode = 200,
  meta?: ApiResponse<T>['meta']
): Response => {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message
  };

  if (meta) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

// Error response helper
export const errorResponse = (
  res: Response,
  error: string | Error,
  statusCode = 500
): Response => {
  const response: ApiResponse<null> = {
    success: false,
    error: error instanceof Error ? error.message : error
  };

  return res.status(statusCode).json(response);
};

// Pagination helper
export const paginateResponse = <T>(
  res: Response,
  data: T[],
  page: number,
  limit: number,
  total: number,
  message = 'Success'
): Response => {
  const totalPages = Math.ceil(total / limit);

  return successResponse(res, data, message, 200, {
    page,
    limit,
    total,
    totalPages
  });
};

// Not found response helper
export const notFoundResponse = (
  res: Response,
  message = 'Resource not found'
): Response => {
  return errorResponse(res, message, 404);
};

// Bad request response helper
export const badRequestResponse = (
  res: Response,
  message = 'Bad request'
): Response => {
  return errorResponse(res, message, 400);
};

// Unauthorized response helper
export const unauthorizedResponse = (
  res: Response,
  message = 'Unauthorized'
): Response => {
  return errorResponse(res, message, 401);
};

// Forbidden response helper
export const forbiddenResponse = (
  res: Response,
  message = 'Forbidden'
): Response => {
  return errorResponse(res, message, 403);
};

// Validation error response helper
export const validationErrorResponse = (
  res: Response,
  errors: string[]
): Response => {
  return errorResponse(res, errors.join(', '), 422);
};

// Conflict response helper
export const conflictResponse = (
  res: Response,
  message = 'Resource already exists'
): Response => {
  return errorResponse(res, message, 409);
};

// Too many requests response helper
export const tooManyRequestsResponse = (
  res: Response,
  message = 'Too many requests'
): Response => {
  return errorResponse(res, message, 429);
};

// Server error response helper
export const serverErrorResponse = (
  res: Response,
  message = 'Internal server error'
): Response => {
  return errorResponse(res, message, 500);
};