import 'dotenv/config';
import { connectDB } from '../src/utils/db';
import { runJobScraping } from '../src/jobs/jobScraper.job';
import logger from '../src/utils/logger';
import { ScrapedJob } from '../src/models/scrapedJob.model';

async function testJobScraper() {
  try {
    // Connect to the database
    logger.info('Connecting to database...');
    await connectDB();
    
    logger.info('Starting job scraper test...');
    
    // Count jobs before scraping
    const beforeCount = await ScrapedJob.countDocuments();
    logger.info(`Found ${beforeCount} jobs in the database before scraping`);
    
    // Run the job scraper
    logger.info('Running job scraper...');
    await runJobScraping();
    
    // Count jobs after scraping
    const afterCount = await ScrapedJob.countDocuments();
    const newJobs = afterCount - beforeCount;
    
    logger.info(`Job scraper completed successfully. Added ${newJobs} new jobs.`);
    
    // List the first 5 jobs as a sample
    if (newJobs > 0) {
      const sampleJobs = await ScrapedJob.find().sort({ createdAt: -1 }).limit(5);
      logger.info('Sample of scraped jobs:', {
        count: sampleJobs.length,
        jobs: sampleJobs.map(job => ({
          title: job.title,
          company: job.company,
          location: job.location,
          source: job.source,
          sourceUrl: job.sourceUrl
        }))
      });
    }
    
    process.exit(0);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.stack : 'Unknown error';
    logger.error(`Job scraper test failed: ${errorMessage}`);
    process.exit(1);
  }
}

testJobScraper();
