import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true // ensure cookies are sent with requests
});

// Add request interceptor to include auth token if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const jobService = {
  // Get all jobs with optional filters
  getJobs: async (filters = {}) => {
    try {
      const response = await api.get('/jobs', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching jobs:', error);
      throw error;
    }
  },

  // Get a single job by ID
  getJobById: async (id: string) => {
    try {
      const response = await api.get(`/jobs/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching job ${id}:`, error);
      throw error;
    }
  },

  // Trigger job scraping (admin only)
  triggerJobScraping: async () => {
    try {
      const response = await api.post('/jobs/scrape');
      return response.data;
    } catch (error) {
      console.error('Error triggering job scraping:', error);
      throw error;
    }
  },
};
