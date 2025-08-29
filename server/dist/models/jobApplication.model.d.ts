import mongoose, { Document, Types } from 'mongoose';
import { IJob } from './job.model';
import { IUser } from './user.model';
export declare enum ApplicationStatus {
    PENDING = "PENDING",
    REVIEWING = "REVIEWING",
    SHORTLISTED = "SHORTLISTED",
    INTERVIEWING = "INTERVIEWING",
    OFFER_MADE = "OFFER_MADE",
    HIRED = "HIRED",
    REJECTED = "REJECTED",
    WITHDRAWN = "WITHDRAWN"
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
export declare const JobApplication: mongoose.Model<IJobApplication, {}, {}, {}, mongoose.Document<unknown, {}, IJobApplication, {}, {}> & IJobApplication & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=jobApplication.model.d.ts.map