import { NextApiResponse } from 'next';
import { ErrorResponseSchema } from './schemas';

/**
 * Utility functions for standardized API responses and error handling.
 * Provides consistent response formats, security headers, and error codes across all endpoints.
 */

export interface ApiError {
  code: string;
  message: string;
}

/**
 * Sends a standardized error response with security headers.
 * Includes runtime validation of the response structure and adds security headers
 * to prevent common web vulnerabilities.
 *
 * @param res - Next.js API response object
 * @param status - HTTP status code
 * @param error - Error object with code and message
 * @param data - Optional additional error data
 */
export function sendError(
  res: NextApiResponse,
  status: number,
  error: ApiError,
  data?: any
) {
  const response = {
    success: false,
    error,
    ...(data && { data }),
  };
  ErrorResponseSchema.parse(response); // Validate at runtime for consistency

  // Security headers to prevent common web vulnerabilities
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  res.status(status).json(response);
}

export function sendSuccess(res: NextApiResponse, data: any, message?: string) {
  const response = {
    success: true,
    data,
    ...(message && { message }),
  };

  // Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  res.json(response);
}

// Common error codes
export const ERROR_CODES = {
  BAD_REQUEST: 'BAD_REQUEST',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  METHOD_NOT_ALLOWED: 'METHOD_NOT_ALLOWED',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
} as const;
