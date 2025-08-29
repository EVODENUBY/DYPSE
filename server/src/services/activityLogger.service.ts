import { UserActivity, IUserActivity } from '../models/userActivity.model';
import mongoose from 'mongoose';

export interface LogActivityParams {
  userId: string | mongoose.Types.ObjectId;
  activityType: IUserActivity['activityType'];
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

export class ActivityLogger {
  /**
   * Log a user activity
   */
  static async logActivity(params: LogActivityParams): Promise<void> {
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
    } catch (error) {
      console.error('Failed to log user activity:', error);
      // Don't throw error as activity logging should not break the main flow
    }
  }

  /**
   * Get recent activities for a user
   */
  static async getRecentActivities(
    userId: string | mongoose.Types.ObjectId, 
    limit: number = 10,
    activityTypes?: IUserActivity['activityType'][]
  ): Promise<IUserActivity[]> {
    try {
      const userObjectId = typeof userId === 'string' 
        ? new mongoose.Types.ObjectId(userId)
        : userId;

      const query: any = { userId: userObjectId };
      
      if (activityTypes && activityTypes.length > 0) {
        query.activityType = { $in: activityTypes };
      }

      const activities = await UserActivity
        .find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();

      return activities;
    } catch (error) {
      console.error('Failed to get recent activities:', error);
      return [];
    }
  }

  /**
   * Get activity statistics for a user
   */
  static async getActivityStats(
    userId: string | mongoose.Types.ObjectId,
    days: number = 30
  ): Promise<Record<string, number>> {
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

      const result: Record<string, number> = {};
      stats.forEach(stat => {
        result[stat._id] = stat.count;
      });

      return result;
    } catch (error) {
      console.error('Failed to get activity stats:', error);
      return {};
    }
  }

  /**
   * Clean old activities (older than specified days)
   */
  static async cleanOldActivities(days: number = 90): Promise<void> {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      await UserActivity.deleteMany({
        createdAt: { $lt: cutoffDate }
      });
    } catch (error) {
      console.error('Failed to clean old activities:', error);
    }
  }
}

// Helper functions for common activities
export const ActivityHelpers = {
  profileUpdate: (userId: string | mongoose.Types.ObjectId, changes: string[]) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'profile_update',
      title: 'Profile updated',
      description: `Updated: ${changes.join(', ')}`,
      metadata: { changes }
    }),

  profilePictureUpload: (userId: string | mongoose.Types.ObjectId, filename?: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'profile_picture_upload',
      title: 'Profile picture uploaded',
      description: 'Added a new profile picture',
      metadata: { filename }
    }),

  cvUpload: (userId: string | mongoose.Types.ObjectId, filename?: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'cv_upload',
      title: 'CV uploaded',
      description: 'Uploaded a new CV document',
      metadata: { filename }
    }),

  skillAdd: (userId: string | mongoose.Types.ObjectId, skillName: string, level?: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'skill_add',
      title: 'New skill added',
      description: `Added skill: ${skillName}${level ? ` (${level})` : ''}`,
      metadata: { skillName, level }
    }),

  skillRemove: (userId: string | mongoose.Types.ObjectId, skillName: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'skill_remove',
      title: 'Skill removed',
      description: `Removed skill: ${skillName}`,
      metadata: { skillName }
    }),

  experienceAdd: (userId: string | mongoose.Types.ObjectId, company: string, role: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'experience_add',
      title: 'Work experience added',
      description: `Added experience: ${role} at ${company}`,
      metadata: { company, role }
    }),

  experienceUpdate: (userId: string | mongoose.Types.ObjectId, company: string, role: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'experience_update',
      title: 'Work experience updated',
      description: `Updated experience: ${role} at ${company}`,
      metadata: { company, role }
    }),

  experienceDelete: (userId: string | mongoose.Types.ObjectId, company: string, role: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'experience_delete',
      title: 'Work experience removed',
      description: `Removed experience: ${role} at ${company}`,
      metadata: { company, role }
    }),

  educationAdd: (userId: string | mongoose.Types.ObjectId, institution: string, degree: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'education_add',
      title: 'Education added',
      description: `Added education: ${degree} at ${institution}`,
      metadata: { institution, degree }
    }),

  educationUpdate: (userId: string | mongoose.Types.ObjectId, institution: string, degree: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'education_update',
      title: 'Education updated',
      description: `Updated education: ${degree} at ${institution}`,
      metadata: { institution, degree }
    }),

  educationDelete: (userId: string | mongoose.Types.ObjectId, institution: string, degree: string) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'education_delete',
      title: 'Education removed',
      description: `Removed education: ${degree} at ${institution}`,
      metadata: { institution, degree }
    }),

  accountCreated: (userId: string | mongoose.Types.ObjectId) => 
    ActivityLogger.logActivity({
      userId,
      activityType: 'account_created',
      title: 'Welcome to DYPSE!',
      description: 'Your account has been created successfully',
      metadata: {}
    })
};
