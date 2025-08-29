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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.UserRole = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Define UserRole enum for use throughout the application
var UserRole;
(function (UserRole) {
    UserRole["YOUTH"] = "youth";
    UserRole["EMPLOYER"] = "employer";
    UserRole["ADMIN"] = "admin";
    UserRole["VERIFIER"] = "verifier";
})(UserRole || (exports.UserRole = UserRole = {}));
const userSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address'],
    },
    passwordHash: {
        type: String,
        required: [true, 'Password hash is required'],
        select: false,
    },
    role: {
        type: String,
        enum: Object.values(UserRole),
        default: UserRole.YOUTH,
    },
    phone: {
        type: String,
        trim: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    emailVerificationToken: {
        type: String,
        select: false,
    },
    emailVerificationExpiry: {
        type: Date,
        select: false,
    },
    resetToken: {
        type: String,
        select: false,
    },
    resetTokenExpiry: {
        type: Date,
        select: false,
    },
    lastLogin: {
        type: Date,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    firstName: {
        type: String,
        trim: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.passwordHash;
            return ret;
        },
    },
});
// Hash password before saving
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('passwordHash')) {
        console.log('Password not modified, skipping hashing');
        return next();
    }
    try {
        if (!this.passwordHash) {
            throw new Error('Password is required');
        }
        console.log('Hashing password for user:', this.email);
        const salt = await bcryptjs_1.default.genSalt(12);
        this.passwordHash = await bcryptjs_1.default.hash(this.passwordHash, salt);
        console.log('Password hashed successfully');
        next();
    }
    catch (error) {
        console.error('Error hashing password:', error);
        next(error);
    }
});
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log('Comparing passwords for user:', this.email);
    console.log('Password hash exists:', !!this.passwordHash);
    if (!candidatePassword || !this.passwordHash) {
        console.log('Missing candidate password or password hash');
        return false;
    }
    try {
        const isMatch = await bcryptjs_1.default.compare(candidatePassword, this.passwordHash);
        console.log('Password comparison result:', isMatch);
        return isMatch;
    }
    catch (error) {
        console.error('Error comparing passwords:', error);
        return false;
    }
};
// Generate JWT token
userSchema.methods.generateAuthToken = function () {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    const payload = {
        id: this._id.toString(),
        role: this.role
    };
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    // Convert days to seconds for JWT expiration
    const expiresIn = 30 * 24 * 60 * 60; // 30 days in seconds
    const secret = process.env.JWT_SECRET;
    const options = { expiresIn };
    return jsonwebtoken_1.default.sign(payload, secret, options);
};
// Add static method to find user by email with password hash
userSchema.statics.findByEmailWithPassword = async function (email) {
    return this.findOne({ email }).select('+passwordHash');
};
// Create and export the model - check if already exists to avoid overwrite error
const User = mongoose_1.default.models.User || mongoose_1.default.model('User', userSchema);
exports.User = User;
//# sourceMappingURL=User.js.map