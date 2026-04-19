import { Router } from 'express';
import { JobController } from '../controllers/JobController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const jobController = new JobController();

router.get('/', asyncErrorWrapper(jobController.getJobs));

export default router;
