import mongoose, { Document } from 'mongoose';
export interface IUserActivity extends Document {
    userId: mongoose.Types.ObjectId;
    activityType: 'profile_update' | 'profile_picture_upload' | 'cv_upload' | 'skill_add' | 'skill_remove' | 'experience_add' | 'experience_update' | 'experience_delete' | 'education_add' | 'education_update' | 'education_delete' | 'job_application' | 'job_bookmark' | 'training_enrollment' | 'account_created' | 'profile_view' | 'login' | 'other';
    title: string;
    description?: string;
    metadata?: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserActivity: mongoose.Model<IUserActivity, {}, {}, {}, mongoose.Document<unknown, {}, IUserActivity, {}, {}> & IUserActivity & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=userActivity.model.d.ts.map