import { Router } from 'express';
import { ActivityLogger } from '../services/activityLogger.service';
import { authenticateToken } from '../middleware/auth.middleware';
const router = Router();
/**
 * GET /api/activity/recent
 * Get recent activities for the authenticated user
 */
router.get('/recent', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const limit = parseInt(req.query.limit) || 10;
        const activityTypes = req.query.types;
        let types;
        if (activityTypes) {
            types = activityTypes.split(',').map(type => type.trim());
        }
        const activities = await ActivityLogger.getRecentActivities(userId, limit, types);
        res.json({
            success: true,
            activities: activities.map(activity => ({
                id: activity._id,
                activityType: activity.activityType,
                title: activity.title,
                description: activity.description,
                metadata: activity.metadata,
                createdAt: activity.createdAt
            }))
        });
    }
    catch (error) {
        console.error('Error fetching recent activities:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent activities'
        });
    }
});
/**
 * GET /api/activity/stats
 * Get activity statistics for the authenticated user
 */
router.get('/stats', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const days = parseInt(req.query.days) || 30;
        const stats = await ActivityLogger.getActivityStats(userId, days);
        res.json({
            success: true,
            stats,
            period: `${days} days`
        });
    }
    catch (error) {
        console.error('Error fetching activity stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity statistics'
        });
    }
});
export default router;
//# sourceMappingURL=activity.routes.js.map