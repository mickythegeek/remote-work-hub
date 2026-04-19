import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { AuthService } from '../services/authService';
import { registerSchema, loginSchema } from '../validators/auth.schema';

const authService = new AuthService();

export class AuthController extends BaseController {
  
  public register = async (req: Request, res: Response) => {
    // 1. Zod input validation
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return this.handleError(res, validation.error.format(), 400, 'Invalid input format');
    }

    try {
      // 2. Delegate to business logic
      const result = await authService.register(validation.data);
      
      // 3. Structured success response
      return this.handleSuccess(res, result, 201, 'User registered successfully');
      
    } catch (error: any) {
      // Handle known service-level conflicts safely
      if (error.message === 'Email already in use') {
        return this.handleError(res, error, 409, error.message);
      }
      // Unknown errors bubble up to our global asyncErrorWrapper to trigger Sentry and a 500
      throw error; 
    }
  };

  public login = async (req: Request, res: Response) => {
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return this.handleError(res, validation.error.format(), 400, 'Invalid input format');
    }

    try {
      const result = await authService.login(validation.data);
      return this.handleSuccess(res, result, 200, 'Login successful');
      
    } catch (error: any) {
      if (error.message === 'Invalid email or password') {
        return this.handleError(res, error, 401, error.message);
      }
      throw error;
    }
  };
}
