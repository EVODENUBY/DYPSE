import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User, UserRole, IUser } from '../../models/user.model';
import { YouthProfile } from '../../models/youthProfile.model';
import { AppError } from '../../utils/errorHandler.js';

export const getAllYouths = async (req: Request, res: Response) => {
  try {
    // First, get all youth users
    const users = await (User as any).find({ role: UserRole.YOUTH })
      .select('email role isVerified updatedAt')
      .lean();

    // Get all youth profiles for these users
    const userIds = users.map(u => u._id);
    const youthProfiles = await (YouthProfile as any).find({ 
      userId: { $in: userIds } 
    }).lean();

    // Create a map of userId -> profile for easy lookup
    const profileMap = new Map();
    youthProfiles.forEach(profile => {
      profileMap.set(profile.userId.toString(), profile);
    });

    // Transform the data to match the frontend expectations
    const result = users.map(user => {
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
        skills: profile?.skills?.map((s: any) => s.name) || [],
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

export const updateVerificationStatus = async (req: Request, res: Response, next: any) => {
  try {
    const { id } = req.params;
    const { isVerified } = req.body;

    if (typeof isVerified !== 'boolean') {
      throw new AppError('Invalid verification status', 400);
    }

    // Start a session for transaction
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Update user verification status
      const user = await (User as mongoose.Model<IUser>).findByIdAndUpdate(
        id,
        { $set: { isVerified } },
        { new: true, runValidators: true, session }
      ).lean().exec();

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
      const populatedUser = await (User as any).findOne({ _id: user._id })
        .select('-password -verificationToken -resetToken -resetTokenExpiry')
        .populate({
          path: 'profile',
          select: 'firstName lastName dateOfBirth phoneNumber jobStatus isVerified district education skills profilePicture'
        })
        .session(session)
        .lean()
        .exec();

      if (!populatedUser) {
        throw new AppError('Failed to fetch updated user data', 500);
      }

      await session.commitTransaction();
      session.endSession();

      // Transform the data to match the frontend expectations
      const profile = populatedUser.profile as any;
      const youthProfile = {
        _id: populatedUser._id,
        firstName: profile?.firstName || 'N/A',
        lastName: profile?.lastName || '',
        location: profile?.district || 'N/A',
        dob: profile?.dateOfBirth || null,
        education: profile?.education?.[0]?.degree || 'N/A',
        skills: profile?.skills?.map((s: any) => s.name) || [],
        jobStatus: profile?.jobStatus || 'unemployed',
        updatedAt: populatedUser.updatedAt,
        phone: profile?.phoneNumber || 'N/A',
        email: populatedUser.email,
        isVerified: populatedUser.isVerified,
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
    if (error instanceof AppError) {
      throw error;
    }
    console.error('Error updating verification status:', error);
    throw new AppError('Failed to update verification status', 500);
  } finally {
    next();
  }
};

export const deleteYouthProfile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Delete user and their profile in a transaction
    const session = await User.startSession();
    session.startTransaction();

    try {
      // Delete user
      await (User as any).findByIdAndDelete(id).session(session);
      
      // Delete associated youth profile
      await (YouthProfile as any).findOneAndDelete({ userId: id }).session(session);
      
      await session.commitTransaction();
      session.endSession();

      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw error;
    }
  } catch (error) {
    throw new AppError('Failed to delete youth profile', 500);
  }
};
