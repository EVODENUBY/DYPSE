import mongoose, { Document, Model, Types } from 'mongoose';
export declare enum UserRole {
    YOUTH = "youth",
    EMPLOYER = "employer",
    ADMIN = "admin",
    VERIFIER = "verifier"
}
interface IUser extends Document {
    _id: Types.ObjectId;
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    firstName?: string;
    lastName?: string;
    phone?: string;
    isEmailVerified: boolean;
    emailVerificationToken?: string;
    emailVerificationExpiry?: Date;
    resetToken?: string;
    resetTokenExpiry?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    lastLogin?: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateAuthToken(): string;
    save(): Promise<this>;
}
export interface IUserModel extends Model<IUser> {
    findByEmailWithPassword(email: string): Promise<(IUser & {
        _id: Types.ObjectId;
    }) | null>;
}
declare global {
    namespace Express {
        interface User {
            id: string;
            role: UserRole;
        }
        interface Request {
            user?: User;
        }
    }
}
declare const User: mongoose.Model<any, {}, {}, {}, any, any>;
export { User, type IUser };
declare global {
    namespace Express {
        interface User {
            id: string;
            role: UserRole;
        }
        interface Request {
            user?: User;
        }
    }
}
//# sourceMappingURL=User.d.ts.map