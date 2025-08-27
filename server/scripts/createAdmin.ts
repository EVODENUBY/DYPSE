// Add this at the very top of createAdmin.ts
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from the .env file in the server directory
dotenv.config({ 
  path: path.resolve(__dirname, '../../.env') 
});

import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/utils/password';
import { env } from '../src/config/env';

// Initialize Prisma with logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function createAdminUser() {
  console.log('Starting admin user creation process...');
  
  const adminEmail = 'evodenuby@gmail.com';
  const adminPassword = 'Admin@1234'; // Strong password for the admin user

  try {
    console.log('Checking database connection...');
    await prisma.$connect();
    console.log('Database connection successful!');

    console.log('Checking for existing admin user...');
    const existingAdmin = await prisma.user.findUnique({
      where: { email: adminEmail },
    });

    if (existingAdmin) {
      console.log('\nAdmin user already exists:');
      console.log('-------------------------');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      console.log(`Status: ${existingAdmin.isActive ? 'Active' : 'Inactive'}`);
      return;
    }

    console.log('Hashing password...');
    const passwordHash = await hashPassword(adminPassword);
    
    console.log('Creating admin user...');
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        role: UserRole.admin,
        isActive: true,
      },
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('-------------------------');
    console.log(`Email: ${adminUser.email}`);
    console.log(`Role: ${adminUser.role}`);
    console.log('Password: Admin@1234');
    console.log('Status: Active');
    console.log('\nYou can now log in with these credentials.');
    
  } catch (error) {
    console.error('\n❌ Error creating admin user:');
    console.error('-------------------------');
    
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      
      // Log additional error details if available
      if ('code' in error) {
        console.error(`Error code: ${error.code}`);
      }
      
      if ('meta' in error) {
        console.error('Error details:', JSON.stringify(error.meta, null, 2));
      }
    } else {
      console.error('Unknown error occurred:', error);
    }
    
    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      console.log('Database connection test: SUCCESS');
    } catch (dbError) {
      console.error('Database connection test: FAILED');
      console.error('Please check your database connection and .env configuration.');
      console.error('Make sure your DATABASE_URL is correctly set in your .env file.');
    }
    
  } finally {
    await prisma.$disconnect();
    console.log('\nDatabase connection closed.');
  }
}

// Run the function with error handling
(async () => {
  try {
    await createAdminUser();
  } catch (error) {
    console.error('Fatal error in admin creation process:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
})();
