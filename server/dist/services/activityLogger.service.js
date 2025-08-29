import { UserActivity } from '../models/userActivity.model';
import mongoose from 'mongoose';
export class ActivityLogger {
    /**
     * Log a user activity
     */
    static async logActivity(params) {
        try {
            const userObjectId = typeof params.userId === 'string'
                ? new mongoose.Types.ObjectId(params.userId)
                : params.userId;
            await UserActivity.create({
                userId: userObjectId,
                activityType: params.activityType,
                title: params.title,
                description: params.description,
                metadata: params.metadata || {}
            });
        }
        catch (error) {
            console.error('Failed to log user activity:', error);
            // Don't throw error as activity logging should not break the main flow
        }
    }
    /**
     * Get recent activities for a user
     */
    static async getRecentActivities(userId, limit = 10, activityTypes) {
        try {
            const userObjectId = typeof userId === 'string'
                ? new mongoose.Types.ObjectId(userId)
                : userId;
            const query = { userId: userObjectId };
            if (activityTypes && activityTypes.length > 0) {
                query.activityType = { $in: activityTypes };
            }
            const activities = await UserActivity
                .find(query)
                .sort({ createdAt: -1 })
                .limit(limit)
                .lean();
            return activities;
        }
        catch (error) {
            console.error('Failed to get recent activities:', error);
            return [];
        }
    }
    /**
     * Get activity statistics for a user
     */
    static async getActivityStats(userId, days = 30) {
        try {
            const userObjectId = typeof userId === 'string'
                ? new mongoose.Types.ObjectId(userId)
                : userId;
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);
            const stats = await UserActivity.aggregate([
                {
                    $match: {
                        userId: userObjectId,
                        createdAt: { $gte: startDate }
                    }
                },
                {
                    $group: {
                        _id: '$activityType',
                        count: { $sum: 1 }
                    }
                }
            ]);
            const result = {};
            stats.forEach(stat => {
                result[stat._id] = stat.count;
            });
            return result;
        }
        catch (error) {
            console.error('Failed to get activity stats:', error);
            return {};
        }
    }
    /**
     * Clean old activities (older than specified days)
     */
    static async cleanOldActivities(days = 90) {
        try {
            const cutoffDate = new Date();
            cutoffDate.setDate(cutoffDate.getDate() - days);
            await UserActivity.deleteMany({
                createdAt: { $lt: cutoffDate }
            });
        }
        catch (error) {
            console.error('Failed to clean old activities:', error);
        }
    }
}
// Helper functions for common activities
export const ActivityHelpers = {
    profileUpdate: (userId, changes) => ActivityLogger.logActivity({
        userId,
        activityType: 'profile_update',
        title: 'Profile updated',
        description: `Updated: ${changes.join(', ')}`,
        metadata: { changes }
    }),
    profilePictureUpload: (userId, filename) => ActivityLogger.logActivity({
        userId,
        activityType: 'profile_picture_upload',
        title: 'Profile picture uploaded',
        description: 'Added a new profile picture',
        metadata: { filename }
    }),
    cvUpload: (userId, filename) => ActivityLogger.logActivity({
        userId,
        activityType: 'cv_upload',
        title: 'CV uploaded',
        description: 'Uploaded a new CV document',
        metadata: { filename }
    }),
    skillAdd: (userId, skillName, level) => ActivityLogger.logActivity({
        userId,
        activityType: 'skill_add',
        title: 'New skill added',
        description: `Added skill: ${skillName}${level ? ` (${level})` : ''}`,
        metadata: { skillName, level }
    }),
    skillRemove: (userId, skillName) => ActivityLogger.logActivity({
        userId,
        activityType: 'skill_remove',
        title: 'Skill removed',
        description: `Removed skill: ${skillName}`,
        metadata: { skillName }
    }),
    experienceAdd: (userId, company, role) => ActivityLogger.logActivity({
        userId,
        activityType: 'experience_add',
        title: 'Work experience added',
        description: `Added experience: ${role} at ${company}`,
        metadata: { company, role }
    }),
    experienceUpdate: (userId, company, role) => ActivityLogger.logActivity({
        userId,
        activityType: 'experience_update',
        title: 'Work experience updated',
        description: `Updated experience: ${role} at ${company}`,
        metadata: { company, role }
    }),
    experienceDelete: (userId, company, role) => ActivityLogger.logActivity({
        userId,
        activityType: 'experience_delete',
        title: 'Work experience removed',
        description: `Removed experience: ${role} at ${company}`,
        metadata: { company, role }
    }),
    educationAdd: (userId, institution, degree) => ActivityLogger.logActivity({
        userId,
        activityType: 'education_add',
        title: 'Education added',
        description: `Added education: ${degree} at ${institution}`,
        metadata: { institution, degree }
    }),
    educationUpdate: (userId, institution, degree) => ActivityLogger.logActivity({
        userId,
        activityType: 'education_update',
        title: 'Education updated',
        description: `Updated education: ${degree} at ${institution}`,
        metadata: { institution, degree }
    }),
    educationDelete: (userId, institution, degree) => ActivityLogger.logActivity({
        userId,
        activityType: 'education_delete',
        title: 'Education removed',
        description: `Removed education: ${degree} at ${institution}`,
        metadata: { institution, degree }
    }),
    accountCreated: (userId) => ActivityLogger.logActivity({
        userId,
        activityType: 'account_created',
        title: 'Welcome to DYPSE!',
        description: 'Your account has been created successfully',
        metadata: {}
    })
};
//# sourceMappingURL=activityLogger.service.js.map