import { Request, Response, NextFunction } from 'express';

// Wrapper generic to catch unhandled promise rejections in Express routes
export const asyncErrorWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
