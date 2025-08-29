import mongoose, { Schema } from 'mongoose';
export var JobStatus;
(function (JobStatus) {
    JobStatus["UNEMPLOYED"] = "unemployed";
    JobStatus["EMPLOYED"] = "employed";
    JobStatus["SELF_EMPLOYED"] = "self_employed";
})(JobStatus || (JobStatus = {}));
const youthProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
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
youthProfileSchema.index({ userId: 1 }, { unique: true });
youthProfileSchema.index({ city: 1 });
youthProfileSchema.index({ country: 1 });
youthProfileSchema.index({ 'skills.name': 1 });
export const YouthProfile = mongoose.model('YouthProfile', youthProfileSchema);
//# sourceMappingURL=youthProfile.model.js.map