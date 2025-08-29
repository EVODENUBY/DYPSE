import mongoose, { Document, Schema, Types } from 'mongoose';
import { IJob } from './job.model';
import { IUser } from './user.model';

export enum ApplicationStatus {
  PENDING = 'PENDING',
  REVIEWING = 'REVIEWING',
  SHORTLISTED = 'SHORTLISTED',
  INTERVIEWING = 'INTERVIEWING',
  OFFER_MADE = 'OFFER_MADE',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
  WITHDRAWN = 'WITHDRAWN',
}

export interface IJobApplication extends Document {
  jobId: Types.ObjectId | IJob;
  userId: Types.ObjectId | IUser;
  coverLetter: string;
  resume: string;
  status: ApplicationStatus;
  isViewed: boolean;
  notes?: string;
  interviewDate?: Date;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplication>(
  {
    jobId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Job', 
      required: true 
    },
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    coverLetter: { 
      type: String, 
      required: true 
    },
    resume: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      enum: Object.values(ApplicationStatus), 
      default: ApplicationStatus.PENDING 
    },
    isViewed: { 
      type: Boolean, 
      default: false 
    },
    notes: { 
      type: String 
    },
    interviewDate: { 
      type: Date 
    },
    feedback: { 
      type: String 
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a user can only apply once to a job
jobApplicationSchema.index({ jobId: 1, userId: 1 }, { unique: true });

// Indexes for better query performance
jobApplicationSchema.index({ userId: 1 });
jobApplicationSchema.index({ status: 1 });
jobApplicationSchema.index({ isViewed: 1 });
jobApplicationSchema.index({ createdAt: -1 });

export const JobApplication = mongoose.model<IJobApplication>('JobApplication', jobApplicationSchema);
