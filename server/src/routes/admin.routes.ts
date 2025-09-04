import express from 'express';
import { authenticateToken, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/user.model';
import { 
  getAllYouths, 
  updateVerificationStatus, 
  deleteYouthProfile 
} from '../controllers/admin/youthProfileController';
import { getAdminDashboardStats } from '../controllers/admin/dashboardController';

const router = express.Router();

// Protect all routes with authentication and admin authorization
router.use(authenticateToken);
router.use(authorize(UserRole.ADMIN));

// Youth profiles management
router.get('/youth-profiles', getAllYouths);
router.patch('/youth-profiles/:id/verify', updateVerificationStatus);
router.delete('/youth-profiles/:id', deleteYouthProfile);

// Dashboard stats
router.get('/dashboard-stats', getAdminDashboardStats);

export default router;
