import mongoose, { Schema } from 'mongoose';
const UserActivitySchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    activityType: {
        type: String,
        enum: [
            'profile_update',
            'profile_picture_upload',
            'cv_upload',
            'skill_add',
            'skill_remove',
            'experience_add',
            'experience_update',
            'experience_delete',
            'education_add',
            'education_update',
            'education_delete',
            'job_application',
            'job_bookmark',
            'training_enrollment',
            'account_created',
            'profile_view',
            'login',
            'other'
        ],
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    metadata: {
        type: Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});
// Create indexes for efficient querying
UserActivitySchema.index({ userId: 1, createdAt: -1 });
UserActivitySchema.index({ userId: 1, activityType: 1, createdAt: -1 });
export const UserActivity = mongoose.model('UserActivity', UserActivitySchema);
//# sourceMappingURL=userActivity.model.js.map