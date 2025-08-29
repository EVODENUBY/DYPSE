import mongoose, { Document, Types } from 'mongoose';
import { IYouthProfile } from './youthProfile.model';
export declare enum UserRole {
    YOUTH = "youth",
    EMPLOYER = "employer",
    ADMIN = "admin",
    VERIFIER = "verifier"
}
export interface IUser extends Document {
    email: string;
    password: string;
    role: UserRole;
    isVerified: boolean;
    verificationToken?: string;
    resetToken?: string;
    resetTokenExpiry?: Date;
    lastLogin?: Date;
    profile?: Types.ObjectId | IYouthProfile;
    createdAt: Date;
    updatedAt: Date;
}
export declare const User: mongoose.Model<any, {}, {}, {}, any, any>;
//# sourceMappingURL=user.model.d.ts.map