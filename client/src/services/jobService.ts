import { jobService as apiJobService } from './api';

export interface JobFilters {
  page?: number;
  limit?: number;
  search?: string;
  location?: string | string[];
  jobType?: string | string[];
  experienceLevel?: string | string[];
  category?: string | string[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: any; // For any additional filter properties
}

export interface JobsResponse {
  success: boolean;
  data: {
    jobs: any[];
    filters: {
      categories: string[];
      jobTypes: string[];
      experienceLevels: string[];
      locations: string[];
    };
  };
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const jobService = {
  // Get all jobs with optional filters
  getJobs: async (filters: JobFilters = {}): Promise<JobsResponse> => {
    try {
      console.log('Fetching jobs with filters:', filters);
      
      // Prepare query parameters
      const params: Record<string, any> = {
        ...filters,
        page: filters.page || 1,
        limit: filters.limit || 10,
        _: Date.now() // Cache buster
      };

      // Convert array filters to comma-separated strings if needed
      const arrayFields = ['category', 'jobType', 'experienceLevel', 'location'];
      arrayFields.forEach(field => {
        if (Array.isArray(params[field])) {
          params[field] = params[field].join(',');
        }
      });
      
      const response = await apiJobService.getJobs(params);
      
      console.log('API Response:', response);
      
      if (!response || !response.success) {
        console.error('Error in response:', response?.message || 'Unknown error');
        throw new Error(response?.message || 'Failed to fetch jobs');
      }
      
      // The backend returns jobs in response.data.jobs
      // and other data in response.pagination and response.filters
      return {
        ...response,
        data: {
          jobs: response.data?.jobs || [],
          filters: response.data?.filters || {
            categories: [],
            jobTypes: [],
            experienceLevels: [],
            locations: []
          }
        },
        pagination: response.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0
        }
      } as JobsResponse;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get a single job by ID
  getJobById: async (id: string) => {
    try {
      return await apiJobService.getJobById(id);
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error);
      throw error;
    }
  },

  // Trigger job scraping (admin only)
  triggerJobScraping: async () => {
    try {
      return await apiJobService.triggerJobScraping();
    } catch (error) {
      console.error('Error triggering job scraping:', error);
      throw error;
    }
  },
};

export default jobService;
