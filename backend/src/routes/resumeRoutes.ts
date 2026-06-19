import { Router } from 'express';
import { ResumeController } from '../controllers/ResumeController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const resumeController = new ResumeController();

router.use(authMiddleware);

router.post('/', asyncErrorWrapper(resumeController.create));
router.get('/:id', asyncErrorWrapper(resumeController.getById));

export default router;
