import { IUserActivity } from '../models/userActivity.model';
import mongoose from 'mongoose';
export interface LogActivityParams {
    userId: string | mongoose.Types.ObjectId;
    activityType: IUserActivity['activityType'];
    title: string;
    description?: string;
    metadata?: Record<string, any>;
}
export declare class ActivityLogger {
    /**
     * Log a user activity
     */
    static logActivity(params: LogActivityParams): Promise<void>;
    /**
     * Get recent activities for a user
     */
    static getRecentActivities(userId: string | mongoose.Types.ObjectId, limit?: number, activityTypes?: IUserActivity['activityType'][]): Promise<IUserActivity[]>;
    /**
     * Get activity statistics for a user
     */
    static getActivityStats(userId: string | mongoose.Types.ObjectId, days?: number): Promise<Record<string, number>>;
    /**
     * Clean old activities (older than specified days)
     */
    static cleanOldActivities(days?: number): Promise<void>;
}
export declare const ActivityHelpers: {
    profileUpdate: (userId: string | mongoose.Types.ObjectId, changes: string[]) => Promise<void>;
    profilePictureUpload: (userId: string | mongoose.Types.ObjectId, filename?: string) => Promise<void>;
    cvUpload: (userId: string | mongoose.Types.ObjectId, filename?: string) => Promise<void>;
    skillAdd: (userId: string | mongoose.Types.ObjectId, skillName: string, level?: string) => Promise<void>;
    skillRemove: (userId: string | mongoose.Types.ObjectId, skillName: string) => Promise<void>;
    experienceAdd: (userId: string | mongoose.Types.ObjectId, company: string, role: string) => Promise<void>;
    experienceUpdate: (userId: string | mongoose.Types.ObjectId, company: string, role: string) => Promise<void>;
    experienceDelete: (userId: string | mongoose.Types.ObjectId, company: string, role: string) => Promise<void>;
    educationAdd: (userId: string | mongoose.Types.ObjectId, institution: string, degree: string) => Promise<void>;
    educationUpdate: (userId: string | mongoose.Types.ObjectId, institution: string, degree: string) => Promise<void>;
    educationDelete: (userId: string | mongoose.Types.ObjectId, institution: string, degree: string) => Promise<void>;
    accountCreated: (userId: string | mongoose.Types.ObjectId) => Promise<void>;
};
//# sourceMappingURL=activityLogger.service.d.ts.map