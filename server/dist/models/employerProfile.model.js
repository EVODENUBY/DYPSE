import mongoose, { Schema } from 'mongoose';
const employerProfileSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    companyName: {
        type: String,
        required: true,
        trim: true
    },
    companyLogo: {
        type: String
    },
    website: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    industry: {
        type: String,
        required: true
    },
    companySize: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    contactPerson: {
        name: {
            type: String,
            required: true
        },
        position: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            lowercase: true
        },
        phone: {
            type: String,
            required: true,
            trim: true
        }
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    jobs: [{
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }]
}, {
    timestamps: true,
});
// Indexes
employerProfileSchema.index({ userId: 1 }, { unique: true });
employerProfileSchema.index({ companyName: 1 });
employerProfileSchema.index({ industry: 1 });
employerProfileSchema.index({ city: 1 });
employerProfileSchema.index({ country: 1 });
export const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);
//# sourceMappingURL=employerProfile.model.js.map