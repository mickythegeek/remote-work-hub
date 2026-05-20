import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { BookmarkService } from '../services/BookmarkService';
import { z } from 'zod';

const bookmarkService = new BookmarkService();

// Zod schema for save job request
const SaveJobSchema = z.object({
  jobId: z.string(),
  jobTitle: z.string(),
  companyName: z.string(),
});

export class BookmarkController extends BaseController {
  public saveJob = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId; // Set by auth middleware
      if (!userId) {
        return this.handleError(res, new Error('Unauthorized'), 401, 'User not authenticated');
      }

      const validation = SaveJobSchema.safeParse(req.body);
      if (!validation.success) {
        return this.handleError(res, validation.error, 400, 'Invalid request body');
      }

      const { jobId, jobTitle, companyName } = validation.data;
      const bookmark = await bookmarkService.saveJob(userId, jobId, jobTitle, companyName);

      return this.handleSuccess(res, bookmark, 201, 'Job saved successfully');
    } catch (error: any) {
      if (error.message.includes('already bookmarked')) {
        return this.handleError(res, error, 409, 'Job is already bookmarked');
      }
      return this.handleError(res, error, 500, 'Failed to save job');
    }
  };

  public unsaveJob = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return this.handleError(res, new Error('Unauthorized'), 401, 'User not authenticated');
      }

      const jobId = req.params.jobId as string;
      if (!jobId || typeof jobId !== 'string') {
        return this.handleError(res, new Error('Missing jobId'), 400, 'Job ID is required');
      }

      const result = await bookmarkService.unsaveJob(userId, jobId);
      return this.handleSuccess(res, result, 200, 'Job removed from bookmarks');
    } catch (error: any) {
      if (error.message.includes('not found')) {
        return this.handleError(res, error, 404, 'Bookmark not found');
      }
      return this.handleError(res, error, 500, 'Failed to remove bookmark');
    }
  };

  public getSavedJobs = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return this.handleError(res, new Error('Unauthorized'), 401, 'User not authenticated');
      }

      const bookmarks = await bookmarkService.getSavedJobs(userId);
      return this.handleSuccess(res, bookmarks, 200, 'Saved jobs retrieved successfully');
    } catch (error: any) {
      return this.handleError(res, error, 500, 'Failed to retrieve saved jobs');
    }
  };

  public isJobSaved = async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      if (!userId) {
        return this.handleError(res, new Error('Unauthorized'), 401, 'User not authenticated');
      }

      const jobId = req.params.jobId as string;
      if (!jobId || typeof jobId !== 'string') {
        return this.handleError(res, new Error('Missing jobId'), 400, 'Job ID is required');
      }

      const isSaved = await bookmarkService.isJobSaved(userId, jobId);
      return this.handleSuccess(res, { isSaved }, 200, 'Checked bookmark status');
    } catch (error: any) {
      return this.handleError(res, error, 500, 'Failed to check bookmark status');
    }
  };
}
