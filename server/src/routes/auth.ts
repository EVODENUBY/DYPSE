import express, { Request, Response } from "express";
const router = express.Router();
import { env } from "../config/env";
import { prisma } from "../config/db";
import type { Prisma } from '@prisma/client';
import { comparePassword, hashPassword } from "../utils/password";
import { JwtPayload } from 'jsonwebtoken';
import jwt from "jsonwebtoken";
import { z } from "zod";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email";
import crypto from 'crypto';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["youth", "employer"], {
    required_error: "Role is required",
    invalid_type_error: "Role must be either 'youth' or 'employer'"
  }),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
});

// All routes in this file are prefixed with /auth in server.ts

// Middleware to verify JWT token
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, env.jwtSecret, (err: any, user: any) => {
    if (err) {
      console.error('JWT verification error:', err);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// Get current user's data
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.sub },
      select: {
        id: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        isEmailVerified: true,
        createdAt: true,
        lastLogin: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // For all users, include basic profile data
    let profileData = {};
    
    if (user.role === 'youth') {
      const profile = await prisma.youthProfile.findUnique({
        where: { userId: user.id },
        select: {
          firstName: true,
          lastName: true,
          dateOfBirth: true,
          gender: true,
          address: true,
          city: true,
          state: true,
          country: true,
          postalCode: true,
          bio: true,
          jobStatus: true,
          skills: {
            select: {
              skill: {
                select: {
                  name: true
                }
              },
              level: true
            }
          }
        },
      });
      profileData = { ...profile };
    } else if (user.role === 'employer') {
      const employerProfile = await prisma.employerProfile.findUnique({
        where: { userId: user.id },
        select: {
          companyName: true,
          companySize: true,
          industry: true,
          website: true,
          logo: true,  // Changed from logo to match schema
          description: true,  // Changed from about to match schema
          contactName: true,
          contactTitle: true,
          phone: true
        } as const,
      });
      
      if (employerProfile) {
        profileData = {
          ...employerProfile,
          // Map 'description' to 'about' for frontend compatibility
          ...(employerProfile.description !== undefined && { about: employerProfile.description }),
          // Map 'logoUrl' to 'logo' for frontend compatibility
          ...(employerProfile.logo !== undefined && { logo: employerProfile.logo })
        };
      }
    }
    
    // Return consistent response format
    return res.json({ 
      data: { 
        user: {
          ...user,
          ...profileData
        } 
      } 
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// All routes in this file are prefixed with /auth in server.ts
router.post('/login', async (req, res) => {
  try {
    console.log('Login attempt with data:', { email: req.body?.email });
    
    const parse = loginSchema.safeParse(req.body);
    if (!parse.success) {
      console.log('Validation failed:', parse.error);
      return res.status(400).json({ error: 'Invalid input', details: parse.error.flatten() });
    }
    
    const { email, password } = parse.data;

    console.log('Looking up user:', email);
    const user = await prisma.user.findUnique({ 
      where: { email },
      select: {
        id: true,
        email: true,
        passwordHash: true,
        role: true,
        phone: true,
        createdAt: true,
        lastLogin: true,
        isActive: true
      }
    });
    
    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    
    if (!user.isActive) {
      console.log('Inactive user attempt:', email);
      return res.status(403).json({ error: 'Account is deactivated' });
    }

    console.log('User found, checking password...');
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      console.log('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    console.log('Password valid, updating last login...');
    await prisma.user.update({ 
      where: { id: user.id }, 
      data: { lastLogin: new Date() } 
    });

    // For youth users, get their profile data
    let profile: { firstName: string; lastName: string } | null = null;
    
    if (user.role === 'youth') {
      console.log('Fetching youth profile for user:', user.id);
      const youthProfile = await prisma.youthProfile.findUnique({
        where: { userId: user.id },
        select: { firstName: true, lastName: true }
      });
      profile = youthProfile ? {
        firstName: youthProfile.firstName || '',
        lastName: youthProfile.lastName || ''
      } : null;
    }

    console.log('Generating JWT token...');
    const token = jwt.sign(
      { sub: user.id, role: user.role },
      env.jwtSecret,
      { expiresIn: '1h' } // Fixed: Using a literal string instead of env.jwtExpiresIn to avoid type issues
    );
    
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      ...(profile as { firstName?: string; lastName?: string } | null || {})
    };
    
    console.log('Login successful for user:', user.id);
    
    // Return both token and user data
    res.json({ 
      token,
      user: userData
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'An unexpected error occurred during login',
      details: process.env.NODE_ENV === 'development' && error instanceof Error ? error.message : undefined

    });
  }
});

// User registration endpoint
router.post('/register', async (req, res) => {
  try {
    console.log('Registration attempt with data:', { email: req.body?.email });
    
    const parse = registerSchema.safeParse(req.body);
    if (!parse.success) {
      console.log('Registration validation failed:', parse.error);
      return res.status(400).json({ 
        error: 'Validation failed', 
        details: parse.error.flatten() 
      });
    }
    
    const { email, password, role, firstName, lastName, phone } = parse.data;

    // Check if user already exists
    console.log('Checking for existing user:', email);
    const existingUser = await prisma.user.findUnique({ 
      where: { email },
      select: { id: true }
    });
    
    if (existingUser) {
      console.log('Registration failed: Email already in use');
      return res.status(409).json({ 
        error: 'Email already in use',
        field: 'email'
      });
    }

    // Hash password
    console.log('Hashing password...');
    const passwordHash = await hashPassword(password);

    // Create user in a transaction to ensure data consistency
    console.log('Creating user in database...');
    const result = await prisma.$transaction(async (tx) => {
      // Type assertion to fix TypeScript error with employerProfile
      const txClient = tx as any;
      // Create user
      const user = await tx.user.create({
        data: {
          email,
          passwordHash,
          role,
          phone,
          isActive: true
        },
        select: {
          id: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true
        }
      });

      // Create profile based on user role
      if (role === 'youth' && firstName && lastName) {
        await txClient.youthProfile.create({
          data: {
            userId: user.id,
            firstName,
            lastName,
            jobStatus: 'unemployed'
          }
        });
      } else if (role === 'employer' && firstName && lastName) {
        // Create a basic employer profile with the provided name
        await txClient.employerProfile.create({
          data: {
            userId: user.id,
            companyName: `${firstName} ${lastName}`,
            contactName: `${firstName} ${lastName}`,
            contactTitle: 'Owner', // Default title
            companySize: '1-10',   // Default size
            industry: 'Other',     // Default industry
            // Add required fields with default values
            address: '',
            city: '',
            state: '',
            country: '',
            postalCode: ''
          }
        });
      }

      return user;
    });

    console.log('User registered successfully:', result.id);
    res.status(201).json({ 
      message: 'Registration successful',
      user: result
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'An unexpected error occurred during registration',
      details: process.env.NODE_ENV === 'development' && error instanceof Error 
        ? error.message 
        : undefined
    });
  }
});

// Generate a random token for password reset
function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * @route POST /auth/request-password-reset
 * @desc Request a password reset email
 * @access Public
 */
router.post('/request-password-reset', async (req, res) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email || !z.string().email().safeParse(email).success) {
      return res.status(400).json({ error: 'Valid email is required' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // If user doesn't exist, don't reveal that to prevent email enumeration
    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }

    // Generate reset token and expiry (1 hour from now)
    const resetToken = generateResetToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken);
    
    console.log(`Password reset email sent to: ${user.email}`);
    res.status(200).json({ message: 'If an account with that email exists, a password reset link has been sent.' });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

/**
 * @route POST /auth/reset-password
 * @desc Reset password using the token from email
 * @access Public
 */
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    // Validate input
    if (!token) {
      return res.status(400).json({ error: 'Reset token is required' });
    }
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Find user by reset token and check if it's not expired
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Check if token is not expired
        },
      },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    // Hash the new password
    const hashedPassword = await hashPassword(password);

    // Update user's password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    console.log(`Password reset successful for user: ${user.email}`);
    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'An error occurred while resetting your password' });
  }
});

export default router;