import mongoose, { Document, Types } from 'mongoose';
import { IUser } from './user.model';
export interface IEmployerProfile extends Document {
    userId: Types.ObjectId | IUser;
    companyName: string;
    companyLogo?: string;
    website?: string;
    description: string;
    industry: string;
    companySize: string;
    phoneNumber: string;
    address: string;
    city: string;
    country: string;
    contactPerson: {
        name: string;
        position: string;
        email: string;
        phone: string;
    };
    isVerified: boolean;
    jobs: Types.ObjectId[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const EmployerProfile: mongoose.Model<IEmployerProfile, {}, {}, {}, mongoose.Document<unknown, {}, IEmployerProfile, {}, {}> & IEmployerProfile & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=employerProfile.model.d.ts.map