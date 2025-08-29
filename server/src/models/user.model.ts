import mongoose, { Document, Schema, Types } from 'mongoose';
import { IYouthProfile } from './youthProfile.model';

export enum UserRole {
  YOUTH = 'youth',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
  VERIFIER = 'verifier',
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

const userSchema = new Schema<IUser>(
  {
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
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
