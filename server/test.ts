console.log('Test script is running!');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// Test ES modules
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('File path:', __filename);
console.log('Directory:', __dirname);

// Test environment variables
console.log('NODE_ENV:', process.env.NODE_ENV || 'development');

// Test MongoDB connection
import mongoose from 'mongoose';

async function testMongoDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/dypse', {
      serverSelectionTimeoutMS: 5000
    });
    console.log('✅ MongoDB connected successfully');
    await mongoose.connection.close();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error instanceof Error ? error.message : error);
  }
}

testMongoDB();
