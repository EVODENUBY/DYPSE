import { Request as ExpressRequest, Response, NextFunction } from 'express';
import mongoose, { ClientSession } from 'mongoose';
import { User, UserRole, IUser } from '../../models/user.model';
import { YouthProfile, IYouthProfile } from '../../models/youthProfile.model';
import { AppError } from '../../utils/errorHandler';

// Extend the Express Request type to include our custom user property
interface Request extends ExpressRequest {
  user?: {
    id: string;
    role: UserRole;
    [key: string]: any;
  };
  params: {
    [key: string]: string;
  };
}

export const getAllYouths = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First, get all youth users
    // Define the shape of the user document
    interface UserDocument {
      _id: mongoose.Types.ObjectId;
      email: string;
      role: UserRole;
      isVerified?: boolean;
      updatedAt: Date;
    }

    // Fetch users with proper typing
    const users = (await User.find({ role: UserRole.YOUTH })
      .select('_id email role isVerified updatedAt')
      .lean()
      .exec()) as unknown as UserDocument[];

    // Get all youth profiles for these users
    const userIds = users.map(u => u._id);
    const youthProfiles = await YouthProfile.find({ 
      userId: { $in: userIds } 
    })
    .lean()
    .exec() as IYouthProfile[];

    // Create a map of userId -> profile for easy lookup
    const profileMap = new Map<string, IYouthProfile>();
    youthProfiles.forEach((profile) => {
      const userId = profile.userId?.toString();
      if (userId) {
        profileMap.set(userId, profile);
      }
    });

    // Transform the data to match the frontend expectations
    const result = users.map((user: UserDocument) => {
      const profile = profileMap.get(user._id.toString());
      
      // Ensure isVerified is always a boolean (default to false if undefined)
      const isVerified = user.isVerified === true;
      
      return {
        _id: user._id,
        firstName: profile?.firstName || 'N/A',
        lastName: profile?.lastName || '',
        location: profile?.district || 'N/A',
        dob: profile?.dateOfBirth || null,
        education: profile?.education?.[0]?.degree || 'N/A',
        skills: profile?.skills?.map((s: { name: string }) => s.name) || [],
        jobStatus: profile?.jobStatus || 'unemployed',
        updatedAt: user.updatedAt,
        phone: profile?.phoneNumber || 'N/A',
        email: user.email,
        isVerified, // This will be a boolean
        profilePicture: profile?.profilePicture
      };
    });

    console.log('Sending response with', result.length, 'youth profiles');
    if (result.length > 0) {
      console.log('Sample profile:', result[0]);
    }
    
    // Match the frontend's expected response format
    res.status(200).json({
      success: true,
      data: result,
      message: 'Youth profiles retrieved successfully'
    });
  } catch (error) {
    console.error('Error fetching youth profiles:', error);
    throw new AppError(
      error instanceof Error ? error.message : 'Failed to fetch youth profiles',
      500
    );
  }
};

export const updateVerificationStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };
    const { isVerified } = req.body as { isVerified: boolean };

    if (typeof isVerified !== 'boolean') {
      throw new AppError('Invalid verification status', 400);
    }

    // Start a session for transaction
    const session: ClientSession = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Update user verification status
      const user = await User.findByIdAndUpdate(
        id,
        { $set: { isVerified } },
        { new: true, runValidators: true, session }
      ).lean().exec() as IUser | null;

      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Also update the profile's isVerified status if it exists
      if (user.profile) {
        await YouthProfile.findByIdAndUpdate(
          user.profile,
          { $set: { isVerified } },
          { session }
        );
      }

      // Populate the profile to include in the response
      const populatedUser = await User.findOne({ _id: user._id })
        .select('-password -verificationToken -resetToken -resetTokenExpiry')
        .populate({
          path: 'profile',
          select: 'firstName lastName dateOfBirth phoneNumber jobStatus isVerified district education skills profilePicture'
        })
        .session(session)
        .lean()
        .exec() as (IUser & { profile: IYouthProfile }) | null;

      if (!populatedUser) {
        throw new AppError('Failed to fetch updated user data', 500);
      }

      await session.commitTransaction();
      session.endSession();

      // Transform the data to match the frontend expectations
      const profile = populatedUser.profile;
      const youthProfile = {
        _id: populatedUser._id,
        firstName: profile?.firstName || 'N/A',
        lastName: profile?.lastName || '',
        location: profile?.district || 'N/A',
        dob: profile?.dateOfBirth || null,
        education: profile?.education?.[0]?.degree || 'N/A',
        skills: profile?.skills?.map((s: { name: string }) => s.name) || [],
        jobStatus: profile?.jobStatus || 'unemployed',
        updatedAt: populatedUser.updatedAt,
        phone: profile?.phoneNumber || 'N/A',
        email: populatedUser.email,
        isVerified: populatedUser.isVerified || false,
        profilePicture: profile?.profilePicture
      };

      res.status(200).json({
        success: true,
        data: {
          user: youthProfile
        },
        message: `User verification ${isVerified ? 'enabled' : 'disabled'} successfully`
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    next(
      error instanceof AppError 
        ? error 
        : new AppError('Failed to update verification status', 500)
    );
  }
};

interface DeleteYouthProfileRequest extends Request {
  params: {
    id: string;
  };
}

export const deleteYouthProfile = async (req: DeleteYouthProfileRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params as { id: string };

    const session = await mongoose.startSession();
    
    try {
      session.startTransaction();
      
      // Delete user
      await User.findByIdAndDelete(id).session(session).exec();

      // Delete associated youth profile
      await YouthProfile.findOneAndDelete({ userId: id }).session(session).exec();
      
      await session.commitTransaction();
      
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }
  } catch (error) {
    next(
      error instanceof AppError 
        ? error 
        : new AppError('Failed to delete youth profile', 500)
    );
  }
};
