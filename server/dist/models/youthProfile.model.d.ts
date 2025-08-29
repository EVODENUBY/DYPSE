import mongoose, { Document, Types } from 'mongoose';
import { IUser } from './user.model';
export declare enum JobStatus {
    UNEMPLOYED = "unemployed",
    EMPLOYED = "employed",
    SELF_EMPLOYED = "self_employed"
}
export interface IYouthProfile extends Document {
    userId: Types.ObjectId | IUser;
    firstName: string;
    lastName?: string;
    dateOfBirth?: Date;
    phoneNumber?: string;
    address?: string;
    city?: string;
    country?: string;
    postalCode?: string;
    district?: string;
    bio?: string;
    profilePicture?: string;
    resume?: string;
    cvUrl?: string;
    jobStatus: JobStatus;
    profileCompletion?: number;
    skills: Array<{
        name: string;
        level: 'beginner' | 'intermediate' | 'expert';
    }>;
    education: Array<{
        institution: string;
        degree: string;
        fieldOfStudy: string;
        startDate: Date;
        endDate?: Date;
        isCurrent: boolean;
    }>;
    experience: Array<{
        title: string;
        company: string;
        location: string;
        startDate: Date;
        endDate?: Date;
        isCurrent: boolean;
        description?: string;
    }>;
    createdAt: Date;
    updatedAt: Date;
}
export declare const YouthProfile: mongoose.Model<IYouthProfile, {}, {}, {}, mongoose.Document<unknown, {}, IYouthProfile, {}, {}> & IYouthProfile & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=youthProfile.model.d.ts.map