"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.requestPasswordReset = exports.authorize = exports.protect = exports.getMe = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_validator_1 = require("express-validator");
const mongoose_1 = require("mongoose");
const crypto_1 = __importDefault(require("crypto"));
const User_1 = require("../models/User");
const User_2 = require("../models/User");
const activityLogger_service_1 = require("../services/activityLogger.service");
const email_1 = require("../utils/email");
// Generate JWT Token
const generateToken = (id, role) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined');
    }
    return jsonwebtoken_1.default.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { firstName, lastName, email, password, phone, role = User_2.UserRole.YOUTH } = req.body;
        // Check if user exists
        const userExists = await User_1.User.findOne({ email }).exec();
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Create user with proper typing
        const user = new User_1.User({
            firstName,
            lastName,
            email,
            phone,
            passwordHash: password, // Will be hashed by the pre-save hook
            role,
            isEmailVerified: false,
            isActive: true,
            lastLogin: new Date()
        });
        // Save the user to generate the _id
        await user.save();
        // Log account creation activity
        activityLogger_service_1.ActivityHelpers.accountCreated(user._id.toString());
        // Generate token
        const token = generateToken(user._id.toString(), user.role);
        res.status(201).json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            token
        });
    }
    catch (error) {
        next(error);
    }
};
exports.register = register;
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        // Find user with password hash
        const user = await User_1.User.findByEmailWithPassword(email);
        if (!user) {
            console.log('No user found with email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        console.log('User found for login:', {
            id: user._id,
            email: user.email,
            hasPasswordHash: !!user.passwordHash,
            userRole: user.role
        });
        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({ message: 'Account is deactivated' });
        }
        // Check password
        try {
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                console.log('Invalid password for user:', email);
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        }
        catch (error) {
            console.error('Error comparing passwords:', error);
            return res.status(500).json({ message: 'Error during authentication' });
        }
        // Generate token
        const token = generateToken(user._id.toString(), user.role);
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        // Return consistent response format
        res.json({
            success: true,
            data: {
                token,
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role,
                    isEmailVerified: user.isEmailVerified,
                    phone: user.phone,
                    lastLogin: user.lastLogin
                }
            }
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res, next) => {
    try {
        // Get the latest user data (not from cache)
        const user = await User_1.User.findOne({ _id: new mongoose_1.Types.ObjectId(req.user?.id) })
            .select('-passwordHash -__v')
            .lean()
            .exec();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        // Create a clean user object with only the fields we want to expose
        const userResponse = {
            _id: user._id,
            email: user.email,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };
        // Return user data in a consistent format
        res.json({
            success: true,
            data: {
                user: userResponse
            }
        });
    }
    catch (error) {
        console.error('Error in getMe:', error);
        next(error);
    }
};
exports.getMe = getMe;
// @desc    Protect routes
// @access  Private
const protect = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token' });
        }
        if (!process.env.JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await User_1.User.findById(decoded.id).select('-passwordHash').lean().exec();
        if (!user) {
            return res.status(401).json({ message: 'Not authorized, user not found' });
        }
        req.user = {
            id: user._id.toString(),
            role: user.role
        };
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};
exports.protect = protect;
// @desc    Authorize roles
// @access  Private
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: `User role ${req.user?.role} is not authorized to access this route`
            });
        }
        next();
    };
};
exports.authorize = authorize;
// @desc    Request password reset
// @route   POST /api/auth/request-password-reset
// @access  Public
const requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User_1.User.findOne({ email }).exec();
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Generate reset token
        const resetToken = crypto_1.default.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now
        user.resetToken = resetToken;
        user.resetTokenExpiry = new Date(resetTokenExpiry);
        await user.save();
        // Send email with reset link
        const userName = user.firstName || user.email.split('@')[0];
        await (0, email_1.sendPasswordResetEmail)(user.email, userName, resetToken);
        res.json({ message: 'Password reset email sent' });
    }
    catch (error) {
        next(error);
    }
};
exports.requestPasswordReset = requestPasswordReset;
// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res, next) => {
    try {
        const { token, password } = req.body;
        const user = await User_1.User.findOne({
            resetToken: token,
            resetTokenExpiry: { $gt: new Date() }
        }).exec();
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }
        // Update password
        user.passwordHash = password; // Will be hashed by pre-save hook
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        if (!user.isActive) {
            return res.status(400).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }
        // Update password (will be hashed by pre-save hook)
        user.passwordHash = password;
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();
        // Send confirmation email
        const userName = user.firstName || user.email.split('@')[0];
        await (0, email_1.sendPasswordResetSuccessEmail)(user.email, userName);
        console.log(`Password reset successfully for user: ${user.email}`);
        res.status(200).json({
            success: true,
            message: 'Password has been reset successfully. You can now log in with your new password.'
        });
    }
    catch (error) {
        console.error('Error in resetPassword:', error);
        next(error);
    }
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map