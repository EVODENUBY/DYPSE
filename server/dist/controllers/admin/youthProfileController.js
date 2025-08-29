"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteYouthProfile = exports.updateVerificationStatus = exports.getAllYouths = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../../models/user.model");
const youthProfile_model_1 = require("../../models/youthProfile.model");
const errorHandler_js_1 = require("../../utils/errorHandler.js");
const getAllYouths = async (req, res) => {
    try {
        // First, get all youth users
        const users = await user_model_1.User.find({ role: user_model_1.UserRole.YOUTH })
            .select('email role isVerified updatedAt')
            .lean();
        // Get all youth profiles for these users
        const userIds = users.map(u => u._id);
        const youthProfiles = await youthProfile_model_1.YouthProfile.find({
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
                skills: profile?.skills?.map((s) => s.name) || [],
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
    }
    catch (error) {
        console.error('Error fetching youth profiles:', error);
        throw new errorHandler_js_1.AppError(error instanceof Error ? error.message : 'Failed to fetch youth profiles', 500);
    }
};
exports.getAllYouths = getAllYouths;
const updateVerificationStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { isVerified } = req.body;
        if (typeof isVerified !== 'boolean') {
            throw new errorHandler_js_1.AppError('Invalid verification status', 400);
        }
        // Start a session for transaction
        const session = await mongoose_1.default.startSession();
        session.startTransaction();
        try {
            // Update user verification status
            const user = await user_model_1.User.findByIdAndUpdate(id, { $set: { isVerified } }, { new: true, runValidators: true, session }).lean().exec();
            if (!user) {
                throw new errorHandler_js_1.AppError('User not found', 404);
            }
            // Also update the profile's isVerified status if it exists
            if (user.profile) {
                await youthProfile_model_1.YouthProfile.findByIdAndUpdate(user.profile, { $set: { isVerified } }, { session });
            }
            // Populate the profile to include in the response
            const populatedUser = await user_model_1.User.findOne({ _id: user._id })
                .select('-password -verificationToken -resetToken -resetTokenExpiry')
                .populate({
                path: 'profile',
                select: 'firstName lastName dateOfBirth phoneNumber jobStatus isVerified district education skills profilePicture'
            })
                .session(session)
                .lean()
                .exec();
            if (!populatedUser) {
                throw new errorHandler_js_1.AppError('Failed to fetch updated user data', 500);
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
                skills: profile?.skills?.map((s) => s.name) || [],
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
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
    catch (error) {
        if (error instanceof errorHandler_js_1.AppError) {
            throw error;
        }
        console.error('Error updating verification status:', error);
        throw new errorHandler_js_1.AppError('Failed to update verification status', 500);
    }
    finally {
        next();
    }
};
exports.updateVerificationStatus = updateVerificationStatus;
const deleteYouthProfile = async (req, res) => {
    try {
        const { id } = req.params;
        // Delete user and their profile in a transaction
        const session = await user_model_1.User.startSession();
        session.startTransaction();
        try {
            // Delete user
            await user_model_1.User.findByIdAndDelete(id).session(session);
            // Delete associated youth profile
            await youthProfile_model_1.YouthProfile.findOneAndDelete({ userId: id }).session(session);
            await session.commitTransaction();
            session.endSession();
            res.status(204).json({
                status: 'success',
                data: null
            });
        }
        catch (error) {
            await session.abortTransaction();
            session.endSession();
            throw error;
        }
    }
    catch (error) {
        throw new errorHandler_js_1.AppError('Failed to delete youth profile', 500);
    }
};
exports.deleteYouthProfile = deleteYouthProfile;
//# sourceMappingURL=youthProfileController.js.map