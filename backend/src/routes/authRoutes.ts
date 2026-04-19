import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const authController = new AuthController();

// Wrap async calls explicitly to protect the Express process
router.post('/register', asyncErrorWrapper(authController.register));
router.post('/login', asyncErrorWrapper(authController.login));

export default router;
