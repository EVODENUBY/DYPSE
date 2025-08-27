import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller';
import { requireRole } from '../middlewares/auth';

const router = Router();

// Admin-only routes
router.post('/', requireRole(['admin']), notificationController.createNotification);

// User routes
router.get('/', notificationController.getUserNotifications);
router.post('/:notificationId/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);
router.get('/unread-count', notificationController.getUnreadCount);

export default router;
