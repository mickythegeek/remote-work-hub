import { Response } from 'express';
import * as Sentry from '@sentry/node';

export class BaseController {
  // Standardize successful responses
  protected handleSuccess(res: Response, data: any, statusCode = 200, message = 'Success') {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  // Standardize error responses and log exceptions to Sentry instantly
  protected handleError(res: Response, error: any, statusCode = 500, message = 'Internal Server Error') {
    Sentry.captureException(error);
    
    // In production, we typically don't want to leak internal stack traces to the user
    return res.status(statusCode).json({
      success: false,
      message,
      error:
        process.env.NODE_ENV === 'development'
          ? (typeof error?.message === 'string' ? error.message : error)
          : undefined,
    });
  }
}
