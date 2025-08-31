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
exports.YouthProfile = exports.JobStatus = void 0;
const mongoose_1 = __importStar(require("mongoose"));
var JobStatus;
(function (JobStatus) {
    JobStatus["UNEMPLOYED"] = "unemployed";
    JobStatus["EMPLOYED"] = "employed";
    JobStatus["SELF_EMPLOYED"] = "self_employed";
})(JobStatus || (exports.JobStatus = JobStatus = {}));
const youthProfileSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true,
        trim: true
    },
    lastName: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    address: {
        type: String
    },
    city: {
        type: String
    },
    country: {
        type: String
    },
    postalCode: {
        type: String
    },
    district: {
        type: String
    },
    bio: {
        type: String
    },
    profilePicture: {
        type: String
    },
    resume: {
        type: String
    },
    cvUrl: {
        type: String
    },
    jobStatus: {
        type: String,
        enum: Object.values(JobStatus),
        default: JobStatus.UNEMPLOYED
    },
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    skills: [{
            name: {
                type: String,
                required: true
            },
            level: {
                type: String,
                enum: ['beginner', 'intermediate', 'expert'],
                required: true
            }
        }],
    education: [{
            institution: {
                type: String,
                required: true
            },
            degree: {
                type: String,
                required: true
            },
            fieldOfStudy: {
                type: String,
                required: true
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date
            },
            isCurrent: {
                type: Boolean,
                default: false
            }
        }],
    experience: [{
            title: {
                type: String,
                required: true
            },
            company: {
                type: String,
                required: true
            },
            location: {
                type: String
            },
            startDate: {
                type: Date,
                required: true
            },
            endDate: {
                type: Date
            },
            isCurrent: {
                type: Boolean,
                default: false
            },
            description: {
                type: String
            }
        }]
}, {
    timestamps: true,
});
// Indexes
youthProfileSchema.index({ city: 1 });
youthProfileSchema.index({ country: 1 });
youthProfileSchema.index({ 'skills.name': 1 });
exports.YouthProfile = mongoose_1.default.model('YouthProfile', youthProfileSchema);
//# sourceMappingURL=youthProfile.model.js.map