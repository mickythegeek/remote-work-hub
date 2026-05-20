import { Router } from 'express';
import { BookmarkController } from '../controllers/BookmarkController';
import { authMiddleware } from '../middleware/authMiddleware';
import { asyncErrorWrapper } from '../utils/asyncErrorWrapper';

const router = Router();
const bookmarkController = new BookmarkController();

// All bookmark routes require authentication
router.use(authMiddleware);

// POST /api/bookmarks - Save a job
router.post('/', asyncErrorWrapper(bookmarkController.saveJob));

// DELETE /api/bookmarks/:jobId - Remove a saved job
router.delete('/:jobId', asyncErrorWrapper(bookmarkController.unsaveJob));

// GET /api/bookmarks - Get all saved jobs for the user
router.get('/', asyncErrorWrapper(bookmarkController.getSavedJobs));

// GET /api/bookmarks/:jobId - Check if a job is saved
router.get('/:jobId', asyncErrorWrapper(bookmarkController.isJobSaved));

export default router;
