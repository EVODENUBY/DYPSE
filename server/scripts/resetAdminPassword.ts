import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../src/models/User';

dotenv.config();

const ADMIN_EMAIL = 'evodemuyisingize@gmail.com';
const ADMIN_PASSWORD = 'admin123'; // Change this to your desired password

async function resetAdminPassword() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    let admin = await User.findOne({ email: ADMIN_EMAIL });
    
    if (!admin) {
      console.log('Admin user not found, creating a new one...');
      admin = new User({
        email: ADMIN_EMAIL,
        role: 'admin',
        isEmailVerified: true,
        isActive: true,
        firstName: 'Admin',
        lastName: 'User'
      });
    }

    // Set the plain password - let the pre-save hook handle hashing
    admin.passwordHash = ADMIN_PASSWORD;
    
    // Save the user (this will trigger the pre-save hook to hash the password)
    await admin.save();
    
    console.log('Admin password has been reset successfully');
    console.log(`Email: ${ADMIN_EMAIL}`);
    console.log(`Password: ${ADMIN_PASSWORD}`);
    
  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetAdminPassword();
