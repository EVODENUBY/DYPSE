import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserSkill extends Document {
  userId: Types.ObjectId;
  skillId: Types.ObjectId;
  level: 'beginner' | 'intermediate' | 'expert';
  endorsements?: number;
  createdAt: Date;
  updatedAt: Date;
}

const skillSchema = new Schema<ISkill>(
  {
    name: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    category: { 
      type: String, 
      required: true,
      trim: true
    },
    description: { 
      type: String 
    }
  },
  {
    timestamps: true,
  }
);

const userSkillSchema = new Schema<IUserSkill>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    skillId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Skill', 
      required: true 
    },
    level: { 
      type: String, 
      enum: ['beginner', 'intermediate', 'expert'], 
      required: true,
      default: 'beginner'
    },
    endorsements: { 
      type: Number, 
      default: 0 
    }
  },
  {
    timestamps: true,
  }
);

// Indexes
skillSchema.index({ name: 1 }, { unique: true });
skillSchema.index({ category: 1 });

userSkillSchema.index({ userId: 1, skillId: 1 }, { unique: true });
userSkillSchema.index({ userId: 1 });
userSkillSchema.index({ skillId: 1 });

export const Skill = mongoose.model<ISkill>('Skill', skillSchema);
export const UserSkill = mongoose.model<IUserSkill>('UserSkill', userSkillSchema);
