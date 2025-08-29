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
exports.JobApplication = exports.ApplicationStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var ApplicationStatus;
(function (ApplicationStatus) {
    ApplicationStatus["PENDING"] = "PENDING";
    ApplicationStatus["REVIEWING"] = "REVIEWING";
    ApplicationStatus["SHORTLISTED"] = "SHORTLISTED";
    ApplicationStatus["INTERVIEWING"] = "INTERVIEWING";
    ApplicationStatus["OFFER_MADE"] = "OFFER_MADE";
    ApplicationStatus["HIRED"] = "HIRED";
    ApplicationStatus["REJECTED"] = "REJECTED";
    ApplicationStatus["WITHDRAWN"] = "WITHDRAWN";
})(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
const jobApplicationSchema = new mongoose_1.Schema({
    jobId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Job',
        required: true
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
exports.JobApplication = mongoose_1.default.model('JobApplication', jobApplicationSchema);
//# sourceMappingURL=jobApplication.model.js.map