import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import mongoose, { Types } from 'mongoose';
import crypto from 'crypto';
import { User, UserRole, type IUser } from '../models/User';
import { ActivityHelpers } from '../services/activityLogger.service';
import { sendPasswordResetEmail, sendPasswordResetSuccessEmail } from '../utils/email';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: UserRole;
      };
    }
  }
}

// Generate JWT Token
const generateToken = (id: string, role: UserRole) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, email, password, phone, role = UserRole.YOUTH } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user with proper typing
    const user = new User({
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
    ActivityHelpers.accountCreated(user._id.toString());

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
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Find user with password hash
    const user = await (User as any).findByEmailWithPassword(email) as any;
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
    } catch (error) {
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
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get the latest user data (not from cache)
    const user = await User.findById(req.user?.id)
      .select('-passwordHash -__v')
      .lean()
      .exec() as unknown as (IUser & { 
        _id: Types.ObjectId; 
        createdAt?: Date; 
        updatedAt?: Date;
        lastLogin?: Date;
      }) | null;
    
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
  } catch (error) {
    console.error('Error in getMe:', error);
    next(error);
  }
};

// @desc    Protect routes
// @access  Private
export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { id: string; role: UserRole };

      // Get user from the token
      const user = await User.findById(decoded.id).select('-passwordHash') as (IUser & { _id: mongoose.Types.ObjectId }) | null;
      
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found or account is inactive' });
      }

      // Attach user to request object
      req.user = {
        id: user._id.toString(),
        role: user.role
      };
      
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @desc    Authorize roles
// @access  Private
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `User role ${req.user?.role} is not authorized to access this route`
      });
    }
    next();
  };
};

// @desc    Request password reset
// @route   POST /api/auth/request-password-reset
// @access  Public
export const requestPasswordReset = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal whether user exists or not for security
      return res.status(200).json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Account is deactivated. Please contact support.'
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save reset token to user
    user.resetToken = resetToken;
    user.resetTokenExpiry = resetTokenExpiry;
    await user.save();

    // Send password reset email
    const userName = user.firstName || user.email.split('@')[0];
    await sendPasswordResetEmail(user.email, userName, resetToken);

    console.log(`Password reset email sent to: ${user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Password reset link has been sent to your email address.'
    });
  } catch (error) {
    console.error('Error in requestPasswordReset:', error);
    
    // Handle email sending errors
    if (error instanceof Error && error.message.includes('Failed to send')) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send reset email. Please try again later.'
      });
    }
    
    next(error);
  }
};

// @desc    Reset password with token
// @route   POST /api/auth/reset-password
// @access  Public
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false,
        errors: errors.array() 
      });
    }

    const { token, password } = req.body;

    // Find user by reset token and check expiry
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token.'
      });
    }

    // Check if user is active
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
    await sendPasswordResetSuccessEmail(user.email, userName);

    console.log(`Password reset successfully for user: ${user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully. You can now log in with your new password.'
    });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    next(error);
  }
};
