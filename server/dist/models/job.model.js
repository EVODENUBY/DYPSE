"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Job = exports.ExperienceLevel = exports.JobType = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var JobType;
(function (JobType) {
    JobType["FULL_TIME"] = "FULL_TIME";
    JobType["PART_TIME"] = "PART_TIME";
    JobType["CONTRACT"] = "CONTRACT";
    JobType["INTERNSHIP"] = "INTERNSHIP";
    JobType["FREELANCE"] = "FREELANCE";
    JobType["TEMPORARY"] = "TEMPORARY";
})(JobType || (exports.JobType = JobType = {}));
var ExperienceLevel;
(function (ExperienceLevel) {
    ExperienceLevel["ENTRY"] = "ENTRY";
    ExperienceLevel["JUNIOR"] = "JUNIOR";
    ExperienceLevel["MID_LEVEL"] = "MID_LEVEL";
    ExperienceLevel["SENIOR"] = "SENIOR";
    ExperienceLevel["EXECUTIVE"] = "EXECUTIVE";
})(ExperienceLevel || (exports.ExperienceLevel = ExperienceLevel = {}));
const jobSchema = new mongoose_1.Schema({
    employerId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
            type: mongoose_1.Schema.Types.ObjectId,
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
exports.Job = mongoose_1.default.model('Job', jobSchema);
//# sourceMappingURL=job.model.js.map