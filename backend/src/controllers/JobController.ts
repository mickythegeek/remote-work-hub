import { Request, Response } from 'express';
import { BaseController } from './BaseController';
import { RemotiveService } from '../services/remotiveService';

const remotiveService = new RemotiveService();

export class JobController extends BaseController {
  public getJobs = async (req: Request, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
    const search = req.query.search as string | undefined;

    const jobs = await remotiveService.getJobs(limit, search);
    return this.handleSuccess(res, jobs, 200, 'Jobs retrieved successfully');
  };
}
