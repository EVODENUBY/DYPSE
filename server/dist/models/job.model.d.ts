import mongoose, { Document, Types } from 'mongoose';
import { IEmployerProfile } from './employerProfile.model';
export declare enum JobType {
    FULL_TIME = "FULL_TIME",
    PART_TIME = "PART_TIME",
    CONTRACT = "CONTRACT",
    INTERNSHIP = "INTERNSHIP",
    FREELANCE = "FREELANCE",
    TEMPORARY = "TEMPORARY"
}
export declare enum ExperienceLevel {
    ENTRY = "ENTRY",
    JUNIOR = "JUNIOR",
    MID_LEVEL = "MID_LEVEL",
    SENIOR = "SENIOR",
    EXECUTIVE = "EXECUTIVE"
}
export interface IJob extends Document {
    employerId: Types.ObjectId | IEmployerProfile;
    title: string;
    description: string;
    requirements: string[];
    responsibilities: string[];
    skills: string[];
    jobType: JobType;
    experienceLevel: ExperienceLevel;
    location: string;
    isRemote: boolean;
    salary: {
        min: number;
        max: number;
        currency: string;
        isPublic: boolean;
    };
    applicationDeadline: Date;
    isActive: boolean;
    applications: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const Job: mongoose.Model<IJob, {}, {}, {}, mongoose.Document<unknown, {}, IJob, {}, {}> & IJob & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=job.model.d.ts.map