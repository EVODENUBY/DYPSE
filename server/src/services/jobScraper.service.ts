import axios from 'axios';
import * as cheerio from 'cheerio';
// No need to import Element, we'll use the DOM type directly
import { ScrapedJob } from '../models/scrapedJob.model';
import { parse, isValid, addDays } from 'date-fns';
import logger from '../utils/logger';

interface JobCardData {
  title: string;
  company: string;
  location: string;
  jobType?: string;
  postedDate?: Date;
  deadline?: Date;
  sourceUrl: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  experience?: string;
}

export class JobScraperService {
  private readonly baseUrl = 'https://www.jobinrwanda.com';
  private readonly jobListUrl = `${this.baseUrl}/jobs/all`;
  private readonly requestDelay = 2000; // 2 seconds between requests
  
  // Common date formats to try when parsing dates
  private readonly dateFormats = [
    'yyyy-MM-dd',      // 2023-12-31
    'dd/MM/yyyy',      // 31/12/2023
    'MM/dd/yyyy',      // 12/31/2023
    'dd MMM yyyy',     // 31 Dec 2023
    'MMM dd, yyyy',    // Dec 31, 2023
    'dd-MM-yyyy',      // 31-12-2023
    'yyyy/MM/dd',      // 2023/12/31
    'dd MMMM yyyy',    // 31 December 2023
    'MMMM dd, yyyy'    // December 31, 2023
  ];

  /**
   * Main method to scrape jobs from JobinRwanda
   */
  public async scrapeJobs(): Promise<{ success: boolean; message: string; count?: number }> {
    try {
      logger.info('🚀 Starting job scraping from JobinRwanda...');
      
      const jobCards = await this.scrapeJobListings();
      let processedCount = 0;
      
      // Process each job listing with a delay to avoid rate limiting
      for (const jobCard of jobCards) {
        try {
          await this.processJobCard(jobCard);
          processedCount++;
          
          // Add delay between requests
          await new Promise(resolve => setTimeout(resolve, this.requestDelay));
        } catch (error) {
          logger.error(`Error processing job ${jobCard.sourceUrl}:`, error);
        }
      }
      
      logger.info(`✅ Successfully processed ${processedCount} jobs`);
      return { 
        success: true, 
        message: `Successfully processed ${processedCount} jobs`,
        count: processedCount
      };
    } catch (error) {
      logger.error('❌ Error in job scraping:', error);
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Unknown error occurred during job scraping'
      };
    }
  }

  /**
   * Scrape job listings from the job list page
   */
  private async scrapeJobListings(): Promise<JobCardData[]> {
    const jobCards: JobCardData[] = [];
    let currentPage = 1;
    const maxPages = 10; // Prevent infinite loops
    
    try {
      while (currentPage <= maxPages) {
        const url = `${this.jobListUrl}?page=${currentPage}`;
        logger.info(`🔍 Scraping page ${currentPage}: ${url}`);
        
        const response = await axios.get(url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }
        });
        
        const $ = cheerio.load(response.data);
        const jobElements = $('.job-list .job-card');
        
        if (jobElements.length === 0) {
          logger.info('No more job listings found');
          break;
        }
        
        // Process each job card
        jobElements.each((_, element) => {
          const jobCard = this.parseJobCard($, $(element));
          if (jobCard) {
            jobCards.push(jobCard);
          }
        });
        
        // Check if there's a next page
        const nextPageLink = $('a[rel="next"]');
        if (!nextPageLink.length) {
          break;
        }
        
        currentPage++;
        
        // Add delay between page requests
        await new Promise(resolve => setTimeout(resolve, this.requestDelay));
      }
    } catch (error) {
      logger.error('Error scraping job listings:', error);
      throw error;
    }
    
    return jobCards;
  }
  
  /**
   * Parse a job card element into a JobCardData object
   */
  private parseJobCard($: cheerio.CheerioAPI, card: any): JobCardData | null {
    try {
      const title = card.find('h5.job-title').text().trim();
      const company = card.find('.company-name').text().trim();
      const location = card.find('.location').text().trim() || 'Kigali, Rwanda';
      const jobType = card.find('.job-type').text().trim() || 'Full-time';
      
      // Extract dates
      const postedDateText = card.find('.posted-date').text().trim();
      const deadlineText = card.find('.deadline').text().trim();
      
      // Get job details URL
      const jobLink = card.find('a[href*="/job/"]').attr('href');
      if (!jobLink) {
        logger.warn('No job URL found for job card');
        return null;
      }
      
      const sourceUrl = jobLink.startsWith('http') 
        ? jobLink 
        : `${this.baseUrl}${jobLink.startsWith('/') ? '' : '/'}${jobLink}`;
      
      // Extract experience if available
      let experience = '';
      const experienceElement = card.find('.experience');
      if (experienceElement.length) {
        experience = experienceElement.text().trim();
      }
      
      return {
        title,
        company: company || 'Not specified',
        location,
        jobType,
        postedDate: this.parseDate(postedDateText) || new Date(),
        deadline: this.parseDate(deadlineText) || this.getDefaultDeadline(),
        sourceUrl,
        description: experience ? `Experience: ${experience}\n\n` : '',
        requirements: [],
        responsibilities: []
      };
    } catch (error) {
      logger.error('Error parsing job card:', error);
      return null;
    }
  }
  
  /**
   * Process a single job card and save it to the database
   */
  private async processJobCard(jobCard: JobCardData): Promise<void> {
    try {
      // Check if job already exists
      const existingJob = await ScrapedJob.findOne({ sourceUrl: jobCard.sourceUrl });
      
      if (existingJob) {
        // Update existing job
        await ScrapedJob.updateOne(
          { _id: existingJob._id },
          { 
            $set: { 
              ...jobCard,
              lastFetched: new Date() 
            } 
          }
        );
        logger.info(`✅ Updated job: ${jobCard.title} at ${jobCard.company}`);
      } else {
        // Create new job
        const newJob = new ScrapedJob({
          ...jobCard,
          source: 'JobinRwanda',
          isActive: true,
          lastFetched: new Date()
        });
        
        await newJob.save();
        logger.info(`✅ Added new job: ${jobCard.title} at ${jobCard.company}`);
      }
    } catch (error) {
      logger.error(`Error processing job ${jobCard.sourceUrl}:`, error);
      throw error;
    }
  }

  /**
   * Parse a date string into a Date object using common formats
   */
  private parseDate(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined;
    
    // Try each date format
    for (const format of this.dateFormats) {
      try {
        const parsedDate = parse(dateString.trim(), format, new Date());
        if (isValid(parsedDate)) {
          return parsedDate;
        }
      } catch (e) {
        // Try next format
      }
    }
    
    // Try to handle relative dates like "2 days ago"
    const relativeMatch = dateString.match(/(\d+)\s+(day|week|month|year)s?\s+ago/i);
    if (relativeMatch) {
      const amount = parseInt(relativeMatch[1], 10);
      const unit = relativeMatch[2].toLowerCase();
      const result = new Date();
      
      switch (unit) {
        case 'day':
          result.setDate(result.getDate() - amount);
          break;
        case 'week':
          result.setDate(result.getDate() - (amount * 7));
          break;
        case 'month':
          result.setMonth(result.getMonth() - amount);
          break;
        case 'year':
          result.setFullYear(result.getFullYear() - amount);
          break;
      }
      
      return result;
    }
    
    logger.warn(`Could not parse date: ${dateString}`);
    return undefined;
  }
  
  /**
   * Get a default deadline (30 days from now)
   */
  private getDefaultDeadline(): Date {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 30);
    return deadline;
  }
}

export default new JobScraperService();
