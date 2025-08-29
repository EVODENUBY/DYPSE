import mongoose, { Document, Types } from 'mongoose';
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
export declare const Skill: mongoose.Model<ISkill, {}, {}, {}, mongoose.Document<unknown, {}, ISkill, {}, {}> & ISkill & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
export declare const UserSkill: mongoose.Model<IUserSkill, {}, {}, {}, mongoose.Document<unknown, {}, IUserSkill, {}, {}> & IUserSkill & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=skill.model.d.ts.map