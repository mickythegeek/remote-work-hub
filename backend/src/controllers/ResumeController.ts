import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { ResumeService } from '../services/ResumeService';
import { createResumeSchema } from '../validators/resume.schema';

const resumeService = new ResumeService();

export class ResumeController extends BaseController {
  public create = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      return this.handleError(res, new Error('Unauthorized'), 401, 'User not authenticated');
    }

    const validation = createResumeSchema.safeParse(req.body);
    if (!validation.success) {
      return this.handleError(res, validation.error.format(), 400, 'Invalid input format');
    }

    try {
      const resume = await resumeService.createResume(userId, validation.data);
      return this.handleSuccess(res, resume, 201, 'Resume created successfully');
    } catch (error: any) {
      throw error;
    }
  };

  public getById = async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      return this.handleError(res, new Error('Unauthorized'), 401, 'User not authenticated');
    }

    const resumeId = typeof req.params.id === 'string' ? req.params.id : req.params.id?.[0];
    if (!resumeId) {
      return this.handleError(res, new Error('Missing resume id'), 400, 'Resume ID is required');
    }

    try {
      const resume = await resumeService.getResumeById(userId, resumeId);
      return this.handleSuccess(res, resume, 200, 'Resume retrieved successfully');
    } catch (error: any) {
      if (error.message === 'Resume not found') {
        return this.handleError(res, error, 404, error.message);
      }
      throw error;
    }
  };
}
