import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '../models/User.js';

// Load environment variables
dotenv.config();

// Admin user details
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@dypse.com';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Admin@1234';
const ADMIN_FIRST_NAME = process.env.ADMIN_FIRST_NAME || 'Admin';
const ADMIN_LAST_NAME = process.env.ADMIN_LAST_NAME || 'User';

async function createAdminUser() {
  try {
    // Connect to MongoDB
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await (User as any).findOne({ email: ADMIN_EMAIL }).exec();
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user
    const adminUser = new User({
      email: ADMIN_EMAIL,
      passwordHash: hashedPassword,
      role: UserRole.ADMIN,
      firstName: ADMIN_FIRST_NAME,
      lastName: ADMIN_LAST_NAME,
      isEmailVerified: true,
      isActive: true,
      phone: process.env.ADMIN_PHONE || '',
      createdAt: new Date(),
    });

    await adminUser.save();
    console.log('Admin user created successfully');
    console.log('Email:', ADMIN_EMAIL);
    console.log('Password:', ADMIN_PASSWORD);

  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the script
createAdminUser().catch(console.error);
