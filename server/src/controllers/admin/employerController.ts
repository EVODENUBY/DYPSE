import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { User, UserRole, type IUser } from '../../models/user.model';
import { EmployerProfile, type IEmployerProfile } from '../../models/employerProfile.model';

export const getAllEmployers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch employer users
    const rawUsers = await User.find({ role: UserRole.EMPLOYER })
      .select('_id email role isVerified createdAt updatedAt')
      .lean()
      .exec();

    const users = (rawUsers as unknown as Array<{ _id: mongoose.Types.ObjectId; email: string; role: string; isVerified?: boolean; createdAt: Date; updatedAt: Date }>);

    const userIds = users.map(u => u._id);

    // Fetch employer profiles
    const profiles = await EmployerProfile.find({ userId: { $in: userIds } })
      .lean()
      .exec() as IEmployerProfile[];

    const profileByUserId = new Map<string, IEmployerProfile>();
    for (const profile of profiles) {
      const key = (profile.userId as any)?.toString?.() ?? '';
      if (key) profileByUserId.set(key, profile);
    }

    // Build response to match frontend expectations
    const result = users.map((u) => {
      const p = profileByUserId.get(u._id.toString());
      return {
        id: u._id,
        email: u.email,
        isVerified: Boolean(p?.isVerified ?? u.isVerified),
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
        activeJobs: Array.isArray(p?.jobs) ? p!.jobs.length : 0,
        // Profile fields
        companyName: p?.companyName ?? 'N/A',
        industry: p?.industry ?? 'N/A',
        companySize: p?.companySize ?? 'N/A',
        website: p?.website ?? '',
        description: p?.description ?? '',
        logoUrl: p?.companyLogo ?? '',
        contactPerson: {
          firstName: p?.contactPerson?.name?.split(' ')?.[0] ?? '',
          lastName: p?.contactPerson?.name?.split(' ')?.slice(1).join(' ') ?? '',
          position: p?.contactPerson?.position ?? '',
          email: p?.contactPerson?.email ?? u.email,
          phone: p?.contactPerson?.phone ?? (p?.phoneNumber ?? ''),
        },
        address: {
          street: p?.address ?? '',
          city: p?.city ?? '',
          state: '',
          country: p?.country ?? '',
          zipCode: '',
        },
        profileVerified: Boolean(p?.isVerified ?? u.isVerified),
      };
    });

    res.status(200).json({
      success: true,
      data: result,
      message: 'Employers retrieved successfully',
    });
  } catch (error) {
    next(error);
  }
};


