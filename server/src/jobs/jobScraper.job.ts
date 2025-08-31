import * as cron from 'node-cron';
import { JobScraperService } from '../services/jobScraper.service';
import logger from '../utils/logger';

const jobScraperService = new JobScraperService();

// Schedule job to run daily at 2 AM
const JOB_SCHEDULE = '0 2 * * *';

// Store the cron task reference
let cronTask: cron.ScheduledTask | null = null;

export const scheduleJobScraping = (): void => {
  // If there's an existing task, stop it first
  if (cronTask) {
    cronTask.stop();
  }

  // Schedule job to run daily at 2 AM
  cronTask = cron.schedule(JOB_SCHEDULE, async () => {
    try {
      logger.info('Running scheduled job scraping...');
      await runJobScraping();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error(`Error in scheduled job scraping: ${errorMessage}`);
    }
  }, {
    timezone: 'Africa/Kigali'
  });
  
  logger.info('Job scraping scheduled to run daily at 2 AM (Kigali time)');
};

// Export for manual triggering
export const runJobScraping = async (): Promise<void> => {
  try {
    logger.info('Starting job scraping...');
    await jobScraperService.scrapeJobs();
    logger.info('Job scraping completed successfully');
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error(`Error in job scraping: ${errorMessage}`);
    throw error;
  }
};

// Run once on startup in development
if (process.env.NODE_ENV === 'development') {
  runJobScraping().catch(error => {
    logger.error('Error during initial job scraping:', error);
  });
}
