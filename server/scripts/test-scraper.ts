import { runJobScraping } from '../src/jobs/jobScraper.job';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/dypse';

async function testScraper() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    console.log('🚀 Starting job scraper test...');
    await runJobScraping();
    
    console.log('✅ Job scraper test completed successfully');
  } catch (error) {
    console.error('❌ Error during job scraper test:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

testScraper();
