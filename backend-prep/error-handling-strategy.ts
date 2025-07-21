/**
 * Comprehensive Error Handling Strategy for Scoop Social API
 * Provides standardized error responses, logging, and monitoring
 */

export interface APIError {
  code: string;
  message: string;
  details?: string;
  field?: string;
  httpStatus: number;
  isOperational: boolean;
  timestamp?: Date;
  requestId?: string;
  userId?: number;
}

export interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: string;
    field?: string;
    timestamp: string;
    requestId?: string;
  };
  meta?: {
    endpoint: string;
    method: string;
    userAgent?: string;
    ip?: string;
  };
}

// =============================================
// Standard Error Codes and Messages
// =============================================

export const ERROR_CODES = {
  // Authentication & Authorization (4xx)
  UNAUTHORIZED: {
    code: 'UNAUTHORIZED',
    message: 'Authentication required',
    httpStatus: 401
  },
  FORBIDDEN: {
    code: 'FORBIDDEN', 
    message: 'Access denied',
    httpStatus: 403
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'Invalid or expired authentication token',
    httpStatus: 401
  },
  INSUFFICIENT_PERMISSIONS: {
    code: 'INSUFFICIENT_PERMISSIONS',
    message: 'Insufficient permissions for this action',
    httpStatus: 403
  },

  // Validation Errors (4xx)
  VALIDATION_ERROR: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid request data',
    httpStatus: 400
  },
  MISSING_REQUIRED_FIELD: {
    code: 'MISSING_REQUIRED_FIELD',
    message: 'Required field is missing',
    httpStatus: 400
  },
  INVALID_FORMAT: {
    code: 'INVALID_FORMAT',
    message: 'Invalid data format',
    httpStatus: 400
  },
  VALUE_TOO_LONG: {
    code: 'VALUE_TOO_LONG',
    message: 'Value exceeds maximum length',
    httpStatus: 400
  },
  VALUE_TOO_SHORT: {
    code: 'VALUE_TOO_SHORT', 
    message: 'Value below minimum length',
    httpStatus: 400
  },

  // Resource Errors (4xx)
  NOT_FOUND: {
    code: 'NOT_FOUND',
    message: 'Requested resource not found',
    httpStatus: 404
  },
  USER_NOT_FOUND: {
    code: 'USER_NOT_FOUND',
    message: 'User not found',
    httpStatus: 404
  },
  EVENT_NOT_FOUND: {
    code: 'EVENT_NOT_FOUND',
    message: 'Event not found',
    httpStatus: 404
  },
  REVIEW_NOT_FOUND: {
    code: 'REVIEW_NOT_FOUND',
    message: 'Review not found',
    httpStatus: 404
  },
  FRIENDSHIP_NOT_FOUND: {
    code: 'FRIENDSHIP_NOT_FOUND',
    message: 'Friendship not found',
    httpStatus: 404
  },

  // Conflict Errors (4xx)
  ALREADY_EXISTS: {
    code: 'ALREADY_EXISTS',
    message: 'Resource already exists',
    httpStatus: 409
  },
  EMAIL_ALREADY_EXISTS: {
    code: 'EMAIL_ALREADY_EXISTS',
    message: 'Email address is already registered',
    httpStatus: 409
  },
  USERNAME_ALREADY_EXISTS: {
    code: 'USERNAME_ALREADY_EXISTS',
    message: 'Username is already taken',
    httpStatus: 409
  },
  ALREADY_FRIENDS: {
    code: 'ALREADY_FRIENDS',
    message: 'Users are already friends',
    httpStatus: 409
  },
  ALREADY_REVIEWED: {
    code: 'ALREADY_REVIEWED',
    message: 'You have already reviewed this user',
    httpStatus: 409
  },
  ALREADY_VOTED: {
    code: 'ALREADY_VOTED',
    message: 'You have already voted on this review',
    httpStatus: 409
  },

  // Business Logic Errors (4xx)
  SELF_ACTION_FORBIDDEN: {
    code: 'SELF_ACTION_FORBIDDEN',
    message: 'Cannot perform this action on yourself',
    httpStatus: 400
  },
  TRUST_SCORE_TOO_LOW: {
    code: 'TRUST_SCORE_TOO_LOW',
    message: 'Trust score too low for this action',
    httpStatus: 403
  },
  EVENT_FULL: {
    code: 'EVENT_FULL',
    message: 'Event has reached maximum capacity',
    httpStatus: 409
  },
  EVENT_ENDED: {
    code: 'EVENT_ENDED',
    message: 'Cannot register for past events',
    httpStatus: 400
  },
  NOT_FRIENDS: {
    code: 'NOT_FRIENDS',
    message: 'Users must be friends to perform this action',
    httpStatus: 403
  },
  PENDING_FRIENDSHIP: {
    code: 'PENDING_FRIENDSHIP',
    message: 'Friendship request already pending',
    httpStatus: 409
  },

  // Rate Limiting (4xx)
  RATE_LIMIT_EXCEEDED: {
    code: 'RATE_LIMIT_EXCEEDED',
    message: 'Too many requests. Please try again later',
    httpStatus: 429
  },

  // File Upload Errors (4xx)
  FILE_TOO_LARGE: {
    code: 'FILE_TOO_LARGE',
    message: 'File size exceeds maximum limit',
    httpStatus: 413
  },
  INVALID_FILE_TYPE: {
    code: 'INVALID_FILE_TYPE',
    message: 'Invalid file type',
    httpStatus: 400
  },
  UPLOAD_FAILED: {
    code: 'UPLOAD_FAILED',
    message: 'File upload failed',
    httpStatus: 500
  },

  // Server Errors (5xx)
  INTERNAL_SERVER_ERROR: {
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected error occurred',
    httpStatus: 500
  },
  DATABASE_ERROR: {
    code: 'DATABASE_ERROR',
    message: 'Database operation failed',
    httpStatus: 500
  },
  EXTERNAL_SERVICE_ERROR: {
    code: 'EXTERNAL_SERVICE_ERROR',
    message: 'External service unavailable',
    httpStatus: 503
  },
  AUTH0_ERROR: {
    code: 'AUTH0_ERROR',
    message: 'Authentication service error',
    httpStatus: 503
  },
  TRUST_CALCULATION_ERROR: {
    code: 'TRUST_CALCULATION_ERROR',
    message: 'Trust score calculation failed',
    httpStatus: 500
  }
};

// =============================================
// Custom Error Classes
// =============================================

export class AppError extends Error {
  public readonly code: string;
  public readonly httpStatus: number;
  public readonly isOperational: boolean;
  public readonly timestamp: Date;
  public readonly field?: string;
  public readonly requestId?: string;
  public readonly userId?: number;

  constructor(
    errorInfo: typeof ERROR_CODES[keyof typeof ERROR_CODES],
    details?: string,
    field?: string,
    requestId?: string,
    userId?: number
  ) {
    super(errorInfo.message);
    
    this.name = 'AppError';
    this.code = errorInfo.code;
    this.httpStatus = errorInfo.httpStatus;
    this.message = details || errorInfo.message;
    this.isOperational = true;
    this.timestamp = new Date();
    this.field = field;
    this.requestId = requestId;
    this.userId = userId;

    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(details: string, field?: string, requestId?: string) {
    super(ERROR_CODES.VALIDATION_ERROR, details, field, requestId);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource', requestId?: string) {
    super(ERROR_CODES.NOT_FOUND, `${resource} not found`, undefined, requestId);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(details: string, requestId?: string) {
    super(ERROR_CODES.ALREADY_EXISTS, details, undefined, requestId);
    this.name = 'ConflictError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(details?: string, requestId?: string) {
    super(ERROR_CODES.UNAUTHORIZED, details, undefined, requestId);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(details?: string, requestId?: string) {
    super(ERROR_CODES.FORBIDDEN, details, undefined, requestId);
    this.name = 'ForbiddenError';
  }
}

export class DatabaseError extends AppError {
  constructor(details?: string, requestId?: string) {
    super(ERROR_CODES.DATABASE_ERROR, details, undefined, requestId);
    this.name = 'DatabaseError';
  }
}

// =============================================
// Error Handling Middleware
// =============================================

/**
 * Global error handling middleware for Express
 */
export function errorHandler(
  error: Error,
  req: any,
  res: any,
  next: any
): void {
  const requestId = req.id || req.headers['x-request-id'] || generateRequestId();
  const userId = req.user?.id;
  const userAgent = req.headers['user-agent'];
  const ip = req.ip || req.connection.remoteAddress;

  // Log error based on severity
  if (error instanceof AppError && error.isOperational) {
    // Operational errors - log as warnings
    console.warn(`[${requestId}] Operational Error:`, {
      code: error.code,
      message: error.message,
      httpStatus: error.httpStatus,
      userId,
      endpoint: `${req.method} ${req.path}`,
      userAgent,
      ip,
      timestamp: error.timestamp
    });
  } else {
    // Programming errors - log as errors with stack trace
    console.error(`[${requestId}] Programming Error:`, {
      name: error.name,
      message: error.message,
      stack: error.stack,
      userId,
      endpoint: `${req.method} ${req.path}`,
      userAgent,
      ip,
      timestamp: new Date()
    });

    // Send error to monitoring service (Sentry, etc.)
    if (process.env.SENTRY_DSN) {
      // await Sentry.captureException(error, { user: { id: userId }, tags: { requestId } });
    }
  }

  // Determine error response
  let errorResponse: ErrorResponse;

  if (error instanceof AppError) {
    errorResponse = {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        details: error.message !== ERROR_CODES[error.code as keyof typeof ERROR_CODES]?.message ? error.message : undefined,
        field: error.field,
        timestamp: error.timestamp.toISOString(),
        requestId
      },
      meta: {
        endpoint: `${req.method} ${req.path}`,
        method: req.method,
        userAgent,
        ip
      }
    };

    res.status(error.httpStatus).json(errorResponse);
  } else {
    // Unknown error - don't leak internal details
    errorResponse = {
      success: false,
      error: {
        code: ERROR_CODES.INTERNAL_SERVER_ERROR.code,
        message: ERROR_CODES.INTERNAL_SERVER_ERROR.message,
        timestamp: new Date().toISOString(),
        requestId
      },
      meta: {
        endpoint: `${req.method} ${req.path}`,
        method: req.method
      }
    };

    res.status(500).json(errorResponse);
  }
}

/**
 * Async error wrapper to catch async errors
 */
export function asyncErrorHandler(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * 404 handler for unmatched routes
 */
export function notFoundHandler(req: any, res: any, next: any): void {
  const requestId = req.id || generateRequestId();
  
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code: ERROR_CODES.NOT_FOUND.code,
      message: `Route ${req.method} ${req.path} not found`,
      timestamp: new Date().toISOString(),
      requestId
    },
    meta: {
      endpoint: `${req.method} ${req.path}`,
      method: req.method
    }
  };

  res.status(404).json(errorResponse);
}

// =============================================
// Error Utilities
// =============================================

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string,
  meta?: Record<string, any>
): { success: true; data: T; message?: string; meta?: Record<string, any> } {
  const response: any = {
    success: true,
    data
  };

  if (message) {
    response.message = message;
  }

  if (meta) {
    response.meta = meta;
  }

  return response;
}

/**
 * Validate and throw specific business logic errors
 */
export const throwIf = {
  notFound: (condition: boolean, resource: string = 'Resource', requestId?: string) => {
    if (condition) {
      throw new NotFoundError(resource, requestId);
    }
  },

  unauthorized: (condition: boolean, details?: string, requestId?: string) => {
    if (condition) {
      throw new UnauthorizedError(details, requestId);
    }
  },

  forbidden: (condition: boolean, details?: string, requestId?: string) => {
    if (condition) {
      throw new ForbiddenError(details, requestId);
    }
  },

  conflict: (condition: boolean, details: string, requestId?: string) => {
    if (condition) {
      throw new ConflictError(details, requestId);
    }
  },

  validation: (condition: boolean, details: string, field?: string, requestId?: string) => {
    if (condition) {
      throw new ValidationError(details, field, requestId);
    }
  },

  trustScoreTooLow: (userTrustScore: number, requiredScore: number, requestId?: string) => {
    if (userTrustScore < requiredScore) {
      throw new AppError(
        ERROR_CODES.TRUST_SCORE_TOO_LOW,
        `Trust score ${userTrustScore} is below required ${requiredScore}`,
        undefined,
        requestId
      );
    }
  },

  selfAction: (userId: number, targetUserId: number, requestId?: string) => {
    if (userId === targetUserId) {
      throw new AppError(ERROR_CODES.SELF_ACTION_FORBIDDEN, undefined, undefined, requestId);
    }
  }
};

/**
 * Database error handler
 */
export function handleDatabaseError(error: any, requestId?: string): never {
  console.error(`[${requestId}] Database Error:`, error);

  // Map common database errors to user-friendly messages
  if (error.code === '23505') { // Unique constraint violation
    if (error.constraint?.includes('email')) {
      throw new ConflictError('Email address is already registered', requestId);
    } else if (error.constraint?.includes('username')) {
      throw new ConflictError('Username is already taken', requestId);
    } else {
      throw new ConflictError('A record with this data already exists', requestId);
    }
  } else if (error.code === '23503') { // Foreign key violation
    throw new ValidationError('Referenced record does not exist', undefined, requestId);
  } else if (error.code === '23514') { // Check constraint violation
    throw new ValidationError('Data violates business rules', undefined, requestId);
  } else if (error.code === 'ECONNREFUSED') {
    throw new DatabaseError('Unable to connect to database', requestId);
  } else {
    throw new DatabaseError('Database operation failed', requestId);
  }
}

/**
 * Auth0 error handler
 */
export function handleAuth0Error(error: any, requestId?: string): never {
  console.error(`[${requestId}] Auth0 Error:`, error);

  if (error.statusCode === 401) {
    throw new UnauthorizedError('Invalid authentication credentials', requestId);
  } else if (error.statusCode === 403) {
    throw new ForbiddenError('Insufficient permissions', requestId);
  } else {
    throw new AppError(ERROR_CODES.AUTH0_ERROR, 'Authentication service temporarily unavailable', undefined, requestId);
  }
}

/**
 * External service error handler (for social media APIs, etc.)
 */
export function handleExternalServiceError(serviceName: string, error: any, requestId?: string): never {
  console.error(`[${requestId}] ${serviceName} Error:`, error);

  throw new AppError(
    ERROR_CODES.EXTERNAL_SERVICE_ERROR,
    `${serviceName} service is temporarily unavailable`,
    undefined,
    requestId
  );
}

// =============================================
// Error Monitoring and Alerting
// =============================================

/**
 * Error metrics for monitoring
 */
export interface ErrorMetrics {
  totalErrors: number;
  errorsByCode: Record<string, number>;
  errorsByEndpoint: Record<string, number>;
  averageResponseTime: number;
  errorRate: number; // percentage
}

let errorMetrics: ErrorMetrics = {
  totalErrors: 0,
  errorsByCode: {},
  errorsByEndpoint: {},
  averageResponseTime: 0,
  errorRate: 0
};

/**
 * Track error metrics
 */
export function trackError(
  error: AppError,
  endpoint: string,
  responseTime: number
): void {
  errorMetrics.totalErrors++;
  errorMetrics.errorsByCode[error.code] = (errorMetrics.errorsByCode[error.code] || 0) + 1;
  errorMetrics.errorsByEndpoint[endpoint] = (errorMetrics.errorsByEndpoint[endpoint] || 0) + 1;
  
  // Update average response time (simple moving average)
  errorMetrics.averageResponseTime = 
    (errorMetrics.averageResponseTime * (errorMetrics.totalErrors - 1) + responseTime) / errorMetrics.totalErrors;
}

/**
 * Get current error metrics
 */
export function getErrorMetrics(): ErrorMetrics {
  return { ...errorMetrics };
}

/**
 * Reset error metrics (useful for testing or periodic resets)
 */
export function resetErrorMetrics(): void {
  errorMetrics = {
    totalErrors: 0,
    errorsByCode: {},
    errorsByEndpoint: {},
    averageResponseTime: 0,
    errorRate: 0
  };
}

// =============================================
// Express Middleware Setup Example
// =============================================

/**
 * Complete error handling setup for Express app
 */
export function setupErrorHandling(app: any): void {
  // Request ID middleware
  app.use((req: any, res: any, next: any) => {
    req.id = generateRequestId();
    res.setHeader('X-Request-ID', req.id);
    next();
  });

  // Add error tracking middleware (should come after all routes)
  app.use((error: any, req: any, res: any, next: any) => {
    const startTime = req.startTime || Date.now();
    const responseTime = Date.now() - startTime;
    
    if (error instanceof AppError) {
      trackError(error, `${req.method} ${req.path}`, responseTime);
    }
    
    next(error);
  });

  // 404 handler (should be before error handler)
  app.use(notFoundHandler);

  // Global error handler (should be last)
  app.use(errorHandler);
} 