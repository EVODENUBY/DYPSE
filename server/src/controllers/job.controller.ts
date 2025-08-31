import { Request, Response } from 'express';
import { ScrapedJob, IScrapedJob } from '../models/scrapedJob.model';
import { runJobScraping } from '../jobs/jobScraper.job';
import logger from '../utils/logger';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      role: string;
    };
  }
}

export const getJobs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      page = '1', 
      limit = '10',
      search,
      location,
      jobType,
      experienceLevel,
      category,
      sortBy = 'postedDate',
      sortOrder = 'desc'
    } = req.query;

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const query: any = { isActive: true };

    // Apply text search if provided
    if (search) {
      query.$text = { $search: search as string };
    }

    // Apply filters
    if (location) {
      query.location = new RegExp(location as string, 'i');
    }

    if (jobType) {
      query.jobType = Array.isArray(jobType) 
        ? { $in: jobType } 
        : jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = Array.isArray(experienceLevel)
        ? { $in: experienceLevel }
        : experienceLevel;
    }

    if (category) {
      query.category = Array.isArray(category)
        ? { $in: category }
        : category;
    }

    // Get unique categories for filters
    const categories = await ScrapedJob.distinct('category', { isActive: true }).sort();

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    // Add debug logging
    console.log('Query:', JSON.stringify(query, null, 2));
    console.log('Sort:', sort);
    console.log('Skip:', skip, 'Limit:', limitNum);
    
    // Get job types and experience levels for filters
    const [jobs, total, jobTypes, experienceLevels] = await Promise.all([
      ScrapedJob.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(),
      ScrapedJob.countDocuments(query),
      ScrapedJob.distinct('jobType', { isActive: true, jobType: { $exists: true, $ne: null } }).sort(),
      ScrapedJob.distinct('experienceLevel', { isActive: true, experienceLevel: { $exists: true, $ne: null } }).sort()
    ]);
    
    console.log(`Found ${jobs.length} jobs out of ${total} total`);
    if (jobs.length > 0) {
      console.log('Sample job:', JSON.stringify(jobs[0], null, 2));
    }

    res.json({
      success: true,
      data: {
        jobs,
        filters: {
          categories,
          jobTypes,
          experienceLevels,
          locations: await ScrapedJob.distinct('location', { isActive: true, location: { $exists: true, $ne: '' } }).sort()
        }
      },
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    logger.error('Error fetching jobs:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      message: 'Error fetching jobs',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    });
  }
};

export const getJobById = async (req: Request, res: Response): Promise<void> => {
  try {
    const job = await ScrapedJob.findById(req.params.id);
    
    if (!job) {
      res.status(404).json({
        success: false,
        message: 'Job not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    logger.error('Error fetching job:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      message: 'Error fetching job',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    });
  }
};

export const triggerJobScraping = async (req: Request, res: Response): Promise<void> => {
  try {
    // This should be protected and only accessible by admins
    if (req.user?.role !== 'ADMIN') {
      res.status(403).json({
        success: false,
        message: 'Unauthorized: Admin access required'
      });
      return;
    }

    // Run the job scraper in the background
    runJobScraping().catch(error => {
      logger.error('Background job scraping failed:', error);
    });

    res.status(202).json({
      success: true,
      message: 'Job scraping started in the background'
    });
  } catch (error) {
    logger.error('Error triggering job scraping:', error instanceof Error ? error.message : 'Unknown error');
    res.status(500).json({
      success: false,
      message: 'Error triggering job scraping',
      error: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : 'Unknown error') : undefined
    });
  }
};
