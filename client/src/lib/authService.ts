const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    isVerified: boolean;
  };
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rwandaId: string;
  phone: string;
  role: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    userId: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
  token: string;
}

export interface UserProfile {
  user: {
    id: string;
    email: string;
    role: string;
    rwandaId: string;
    firstName: string;
    lastName: string;
    phone: string;
    isVerified: boolean;
    createdAt: string;
  };
  documents: Array<{
    documentType: string;
    fileName: string;
    originalName: string;
    uploadDate: string;
    isVerified: boolean;
  }>;
}

export interface ProfileResponse {
  success: boolean;
  data: UserProfile;
}

class AuthService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Network error occurred');
    }
  }

  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return this.request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData: RegisterRequest): Promise<RegisterResponse> {
    return this.request<RegisterResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<{ success: boolean; message: string }> {
    return this.request<{ success: boolean; message: string }>('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile(token: string): Promise<ProfileResponse> {
    return this.request<ProfileResponse>('/auth/profile', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
  }

  // Helper method to check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token;
  }

  // Helper method to get stored token
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Helper method to set token
  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Helper method to remove token
  removeToken(): void {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService();
export default authService;