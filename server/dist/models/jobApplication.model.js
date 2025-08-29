import mongoose, { Schema } from 'mongoose';
export var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "PENDING";
    ApplicationStatus["REVIEWING"] = "REVIEWING";
    ApplicationStatus["SHORTLISTED"] = "SHORTLISTED";
    ApplicationStatus["INTERVIEWING"] = "INTERVIEWING";
    ApplicationStatus["OFFER_MADE"] = "OFFER_MADE";
    ApplicationStatus["HIRED"] = "HIRED";
    ApplicationStatus["REJECTED"] = "REJECTED";
    ApplicationStatus["WITHDRAWN"] = "WITHDRAWN";
})(ApplicationStatus || (ApplicationStatus = {}));
const jobApplicationSchema = new Schema({
    jobId: {
        type: Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    coverLetter: {
        type: String,
        required: true
    },
    resume: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(ApplicationStatus),
        default: ApplicationStatus.PENDING
    },
    isViewed: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String
    },
    interviewDate: {
        type: Date
    },
    feedback: {
        type: String
    },
}, {
    timestamps: true,
});
// Compound index to ensure a user can only apply once to a job
jobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });
// Indexes for better query performance
jobApplicationSchema.index({ userId: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ isViewed: 1 });
jobApplicationSchema.index({ createdAt: -1 });
export const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);
//# sourceMappingURL=jobApplication.model.js.map