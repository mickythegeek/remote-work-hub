import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { unifiedConfig } from '../config/unifiedConfig';

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Missing or invalid Authorization header',
      });
    }

    const token = authHeader.slice(7); // Remove "Bearer " prefix
    
    // Verify and decode token
    const decoded = jwt.verify(token, unifiedConfig.JWT_SECRET) as { userId: string; email: string };
    
    // Set userId on request for downstream handlers
    req.userId = decoded.userId;
    
    next();
  } catch (error: any) {
    return res.status(401).json({
      success: false,
      message: error.message.includes('expired') ? 'Token expired' : 'Invalid token',
    });
  }
};
