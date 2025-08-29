import mongoose, { Schema } from 'mongoose';
export var UserRole;
(function (UserRole) {
    UserRole["YOUTH"] = "youth";
    UserRole["EMPLOYER"] = "employer";
    UserRole["ADMIN"] = "admin";
    UserRole["VERIFIER"] = "verifier";
})(UserRole || (UserRole = {}));
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        required: true,
        default: UserRole.YOUTH
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    profile: {
        type: Schema.Types.ObjectId,
        ref: 'YouthProfile'
    },
    verificationToken: {
        type: String
    },
    resetToken: {
        type: String
    },
    resetTokenExpiry: {
        type: Date
    },
    lastLogin: {
        type: Date
    },
}, {
    timestamps: true,
});
// Indexes
userSchema.index({ email: 1 }, { unique: true });
export const User = mongoose.models.User || mongoose.model('User', userSchema);
//# sourceMappingURL=user.model.js.map