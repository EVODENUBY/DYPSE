import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { getEmployerDashboardStats } from '../controllers/employer/dashboardController';

const router = express.Router();

// Middleware to ensure only employers can access these routes
router.use(authenticateToken, authorize('employer'));

// Employer dashboard statistics
router.get('/dashboard-stats', getEmployerDashboardStats);

export default router;
