import axios, { type AxiosInstance, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import type { YouthProfile } from '../pages/admin/YouthProfilesPage';

// Use Vite's environment variables with fallback for production
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://dypse.onrender.com/api';

// Log API base URL in development
if (import.meta.env.DEV) {
  console.log(`[DEV] API Base URL: ${API_BASE_URL}`);
}

// Custom error class for network-related errors
export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  status?: number;
  code?: string;
  
  constructor(message: string, status?: number, code?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
  }
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  token?: string;
  statusCode?: number;
  code?: string;
}

interface User {
  id: string;
  email: string;
  role: 'youth' | 'employer' | 'admin' | 'verifier';
  isEmailVerified: boolean;
  profile?: any;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  // Add timeout and other options if needed
  timeout: 10000,
});

// Network status check
const isOnline = () => {
  return typeof navigator !== 'undefined' && navigator.onLine;
};

// Request interceptor to include auth token and handle offline state
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Check network connectivity
    if (!isOnline()) {
      throw new NetworkError('No internet connection. Please check your network and try again.');
    }

    // Add auth token if available
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Store the current path before redirecting to login
let isRedirecting = false;

// Response interceptor for handling errors and retries
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError<ApiResponse>) => {
    // Handle network errors
    if (error.code === 'ECONNABORTED' || !window.navigator.onLine) {
      throw new NetworkError('Network error. Please check your internet connection and try again.');
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes('/login');
      const requestUrl = error.config?.url || '';
      
      // Don't redirect if we're already on the login page
      if (isLoginPage) {
        throw new ApiError('Invalid credentials. Please check your email and password.', 401, 'INVALID_CREDENTIALS');
      }
      
      // Don't redirect for optional activity endpoints - let them handle their own errors
      const isActivityEndpoint = requestUrl.includes('/activity/');
      if (isActivityEndpoint) {
        throw new ApiError('Activity data unavailable', 401, 'ACTIVITY_UNAUTHORIZED');
      }
      
      // Only redirect if we're not already redirecting
      if (!isRedirecting) {
        isRedirecting = true;
        localStorage.removeItem('token');
        
        // Store the current path for redirecting back after login
        const redirectPath = currentPath === '/' ? '' : `?redirect=${encodeURIComponent(currentPath)}`;
        window.location.href = `/login${redirectPath}`;
        
        // Reset the flag after a delay to prevent multiple redirects
        setTimeout(() => {
          isRedirecting = false;
        }, 1000);
      }
      
      throw new ApiError('Your session has expired. Please log in again.', 401, 'UNAUTHORIZED');
    }

    // Handle other API errors
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.message || error.message || 'An error occurred';
      
      // Don't show 404 errors for API endpoints
      if (status !== 404) {
        console.error(`API Error ${status}:`, message);
      }
      
      throw new ApiError(message, status, data?.code);
    }

    // For any other errors, rethrow
    return Promise.reject(error);
  }
);

export const authAPI = {
  // Register a new user
  register: async (userData: {
    email: string;
    password: string;
    role: 'youth' | 'employer';
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<ApiResponse<{ user: User }>> => {
    const response = await api.post<ApiResponse<{ user: User }>>('/auth/register', userData);
    return response.data;
  },

  // Login user with enhanced error handling
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    try {
      const response = await api.post<ApiResponse<{ token: string; user: User }>>('/auth/login', credentials);
      
      // Check if the response has the expected format
      if (!response.data?.data?.token || !response.data.data.user) {
        console.error('Invalid response format from server:', response.data);
        throw new ApiError('Authentication failed: Invalid server response', 500, 'INVALID_RESPONSE');
      }
      
      // Store the token
      localStorage.setItem('token', response.data.data.token);
      
      // Return the user data and token
      return {
        token: response.data.data.token,
        user: response.data.data.user
      };
      
    } catch (error: any) {
      console.error('Login API error:', error);
      
      // Re-throw the error if it's already one of our custom errors
      if (error instanceof NetworkError || error instanceof ApiError) {
        throw error;
      }
      
      // Handle axios specific errors
      if (error.isAxiosError) {
        // Handle network errors
        if (!error.response) {
          throw new NetworkError('Unable to connect to the server. Please check your internet connection.');
        }
        
        const status = error.response?.status;
        const message = error.response?.data?.message || 'Login failed';
        
        // Handle specific error cases
        if (status === 401) {
          throw new ApiError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
        }
        
        if (status === 400 && error.response.data?.errors) {
          // Handle validation errors
          const firstError = error.response.data.errors[0]?.msg || 'Invalid input';
          throw new ApiError(firstError, 400, 'VALIDATION_ERROR');
        }
        
        if (status >= 500) {
          throw new ApiError('Server error. Please try again later.', status, 'SERVER_ERROR');
        }
        
        // For other API errors, use the server's message
        throw new ApiError(message, status);
      }
      
      // For any other errors
      throw new Error(error.message || 'An unexpected error occurred during login');
    }
  },

  // Get current user with enhanced error handling
  getCurrentUser: async (): Promise<User> => {
    try {
      const response = await api.get<ApiResponse<{ user: any }>>('/auth/me');
      
      if (!response.data?.success || !response.data.data?.user) {
        console.error('Invalid response format:', response.data);
        throw new ApiError(
          response.data?.message || 'Failed to load user data',
          response.data?.statusCode || 500,
          response.data?.code
        );
      }
      
      const userData = response.data.data.user;
      
      // Map the server response to the User interface
      return {
        id: userData._id || userData.id,
        email: userData.email,
        role: userData.role,
        isEmailVerified: userData.isEmailVerified || false,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        profile: userData.profile || {}
      };
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      // Clear invalid token if the request fails with 401
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
      }
      throw error; // Re-throw to be handled by the caller
    }
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem('token');
  },

  // Request password reset
  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/request-password-reset', { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token: string, password: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/reset-password', { token, password });
    return response.data;
  },
};

// Youth Profile API
export const youthApi = {
  // Get all youth profiles
  async getAllYouths() {
    try {
      const response = await api.get<ApiResponse<YouthProfile[]>>('/admin/youth-profiles');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(
          error.response.data?.message || 'Failed to fetch youth profiles',
          error.response.status,
          error.response.data?.code
        );
      }
      throw new NetworkError('Failed to connect to the server');
    }
  },

  // Update youth verification status
  async updateVerification(id: string, isVerified: boolean): Promise<ApiResponse<{ user: YouthProfile }>> {
    try {
      console.log(`[API] Updating verification status for user ${id} to ${isVerified}`);
      const url = `/admin/youth-profiles/${id}/verify`;
      console.log(`[API] Making PATCH request to: ${url}`);
      
      const { data } = await api.patch<ApiResponse<{ user: YouthProfile }>>(
        url,
        { isVerified },
        { 
          timeout: 10000, // 10 second timeout
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );
      
      console.log(`[API] Verification update response:`, data);
      
      if (!data.success) {
        console.error(`[API] Verification update failed: ${data.message}`);
        throw new Error(data.message || 'Failed to update verification status');
      }
      
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(
          error.response.data?.message || 'Failed to update verification status',
          error.response.status,
          error.response.data?.code
        );
      }
      throw new NetworkError('Failed to connect to the server');
    }
  },

  // Delete youth profile
  async deleteYouth(id: string) {
    try {
      const response = await api.delete<ApiResponse>(`/admin/youth-profiles/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new ApiError(
          error.response.data?.message || 'Failed to delete youth profile',
          error.response.status,
          error.response.data?.code
        );
      }
      throw new NetworkError('Failed to connect to the server');
    }
  }
};

export default api;