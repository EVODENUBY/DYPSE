import axios, { type AxiosInstance, type AxiosResponse, type AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  token?: string;
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
  },
  withCredentials: true,
});

// Add a request interceptor to include the auth token with requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Use a simple object for headers to avoid type issues
      config.headers = config.headers || {};
      // Use bracket notation to avoid TypeScript errors
      (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle 401 Unauthorized
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  (error: AxiosError<ApiResponse>): Promise<never> => {
    if (error.response?.status === 401) {
      // Remove any invalid/expired token and let callers handle navigation
      localStorage.removeItem('token');
      return Promise.reject(error);
    }
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

  // Login user
  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data as LoginResponse;
  },

  // Get current user
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    if (!response.data.data) {
      throw new Error('Failed to fetch user data');
    }
    return response.data.data.user;
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
  resetPassword: async (token: string, newPassword: string): Promise<ApiResponse> => {
    const response = await api.post<ApiResponse>('/auth/reset-password', { token, newPassword });
    return response.data;
  },
};

export default api;