import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User';
import { getJobs, getJobById, triggerJobScraping } from '../controllers/job.controller';

const router = express.Router();

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Protected admin routes
router.post('/scrape', authenticateToken, authorize(UserRole.ADMIN), triggerJobScraping);

// Add more protected routes as needed
// router.post('/', protect, authorize('employer'), createJob);
// router.put('/:id', protect, authorize('employer'), updateJob);
// router.delete('/:id', protect, authorize('employer'), deleteJob);

export default router;
