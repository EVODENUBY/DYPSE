import mongoose, { Document, Model, Schema, model, Types } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt, { SignOptions } from 'jsonwebtoken';

// Define UserRole enum for use throughout the application
export enum UserRole {
  YOUTH = 'youth',
  EMPLOYER = 'employer',
  ADMIN = 'admin',
  VERIFIER = 'verifier'
}

// Interface for User document
interface IUser extends Document {
  _id: Types.ObjectId;
  id: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  phone?: string;
  isEmailVerified: boolean;
  emailVerificationToken?: string;
  emailVerificationExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  firstName?: string;
  lastName?: string;
  
  // Methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

// Interface for User model
export interface IUserModel extends Model<IUser> {
  // Static methods
  findByEmailWithPassword(email: string): Promise<(IUser & { _id: Types.ObjectId }) | null>;
}

// Type declarations for Express
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

const userSchema = new Schema<IUser, IUserModel>(
  {
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
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.passwordHash;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
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
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    console.log('Password hashed successfully');
    next();
  } catch (error) {
    console.error('Error hashing password:', error);
    next(error as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  console.log('Comparing passwords for user:', this.email);
  console.log('Password hash exists:', !!this.passwordHash);
  
  if (!candidatePassword || !this.passwordHash) {
    console.log('Missing candidate password or password hash');
    return false;
  }
  
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.passwordHash);
    console.log('Password comparison result:', isMatch);
    return isMatch;
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
};

// Generate JWT token
userSchema.methods.generateAuthToken = function (): string {
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
  const secret: jwt.Secret = process.env.JWT_SECRET;
  const options: jwt.SignOptions = { expiresIn };
  
  return jwt.sign(payload, secret, options);
};

// Add static method to find user by email with password hash
userSchema.statics.findByEmailWithPassword = async function(email: string) {
  return this.findOne({ email }).select('+passwordHash');
};

// Create and export the model - check if already exists to avoid overwrite error
const User = mongoose.models.User || mongoose.model<IUser, IUserModel>('User', userSchema);

export { User, type IUser };

// Extend Express Request type with user property
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
