import mongoose, { Schema } from 'mongoose';
export var JobType;
(function (JobType) {
    JobType["FULL_TIME"] = "FULL_TIME";
    JobType["PART_TIME"] = "PART_TIME";
    JobType["CONTRACT"] = "CONTRACT";
    JobType["INTERNSHIP"] = "INTERNSHIP";
    JobType["FREELANCE"] = "FREELANCE";
    JobType["TEMPORARY"] = "TEMPORARY";
})(JobType || (JobType = {}));
export var ExperienceLevel;
(function (ExperienceLevel) {
    ExperienceLevel["ENTRY"] = "ENTRY";
    ExperienceLevel["JUNIOR"] = "JUNIOR";
    ExperienceLevel["MID_LEVEL"] = "MID_LEVEL";
    ExperienceLevel["SENIOR"] = "SENIOR";
    ExperienceLevel["EXECUTIVE"] = "EXECUTIVE";
})(ExperienceLevel || (ExperienceLevel = {}));
const jobSchema = new Schema({
    employerId: {
        type: Schema.Types.ObjectId,
        ref: 'EmployerProfile',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
            type: String,
            required: true
        }],
    responsibilities: [{
            type: String,
            required: true
        }],
    skills: [{
            type: String
        }],
    jobType: {
        type: String,
        enum: Object.values(JobType),
        required: true
    },
    experienceLevel: {
        type: String,
        enum: Object.values(ExperienceLevel),
        required: true
    },
    location: {
        type: String,
        required: true
    },
    isRemote: {
        type: Boolean,
        default: false
    },
    salary: {
        min: {
            type: Number,
            required: true
        },
        max: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'USD'
        },
        isPublic: {
            type: Boolean,
            default: true
        },
    },
    applicationDeadline: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applications: [{
            type: Schema.Types.ObjectId,
            ref: 'JobApplication'
        }],
}, {
    timestamps: true,
});
// Indexes for better query performance
jobSchema.index({ employerId: 1 });
jobSchema.index({ jobType: 1 });
jobSchema.index({ experienceLevel: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ isRemote: 1 });
jobSchema.index({ isActive: 1 });
jobSchema.index({ 'salary.min': 1, 'salary.max': 1 });
jobSchema.index({ createdAt: -1 });
// Text index for search functionality
jobSchema.index({
    title: 'text',
    description: 'text',
    requirements: 'text',
    responsibilities: 'text',
    skills: 'text',
    location: 'text'
}, {
    weights: {
        title: 10,
        skills: 5,
        requirements: 2,
        responsibilities: 2,
        description: 1,
        location: 1
    },
    name: 'job_search_index'
});
export const Job = mongoose.model('Job', jobSchema);
//# sourceMappingURL=job.model.js.map