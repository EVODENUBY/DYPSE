import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  role: 'youth' | 'employer' | 'admin' | 'verifier';
  isEmailVerified?: boolean;
  companyName?: string;
  contactName?: string;
  profile?: any; 
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    email: string;
    password: string;
    role: 'youth' | 'employer';
    firstName?: string;
    lastName?: string;
    phone?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEmployer: boolean;
  isYouth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const userData = await authAPI.getCurrentUser();
          // Ensure all required fields are present
          const user: User = {
            id: userData.id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            phone: userData.phone,
            role: userData.role,
            isEmailVerified: userData.isEmailVerified,
            companyName: (userData as any).companyName,
            contactName: (userData as any).contactName,
            profile: userData.profile
          };
          setUser(user);
        }
      } catch (error) {
        console.error('Failed to load user', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    setLoading(true);
    
    // Validate input
    if (!email || !password) {
      setLoading(false);
      return { success: false, message: 'Please enter both email and password' };
    }
    
    // Network guard
    if (!navigator.onLine) {
      setLoading(false);
      return { success: false, message: 'No internet connection. Please check your network.' };
    }

    try {
      const data = await authAPI.login({ email, password });
      if (!data?.token) {
        setLoading(false);
        return { success: false, message: 'Authentication failed. Please try again.' };
      }

      // Get user data after successful login
      const userData = await authAPI.getCurrentUser();
      const user: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role,
        isEmailVerified: userData.isEmailVerified || false,
        companyName: (userData as any).companyName,
        contactName: (userData as any).contactName,
        profile: userData.profile
      };

      setUser(user);
      toast.success('Login successful!');

      const redirectPath = {
        'admin': '/admin',
        'employer': '/employer/dashboard',
        'youth': '/youth/dashboard',
        'verifier': '/verifier/dashboard'
      }[user.role] || '/dashboard';
      navigate(redirectPath);
      setLoading(false);
      return { success: true };

    } catch (error: any) {
      // Map errors to message without throwing
      let message = 'Login failed. Please try again.';

      const status = error?.response?.status;
      const data = error?.response?.data as any;

      if (status === 401) {
        message = 'Invalid username or password.';
      } else if (status === 400) {
        // Try to extract Zod validation messages
        const details = data?.details;
        const fieldErrors = details?.fieldErrors;
        const formErrors = details?.formErrors;
        const firstFieldError = fieldErrors && Object.values(fieldErrors).flat().find(Boolean);
        const firstFormError = Array.isArray(formErrors) && formErrors.find(Boolean);
        message = (firstFieldError as string) || (firstFormError as string) || data?.error || 'Invalid input.';
      } else if (error?.code === 'ERR_NETWORK' || !window.navigator.onLine) {
        message = 'Network error. Please check your internet connection.';
      } else if (data?.message) {
        message = data.message;
      } else if (error?.message) {
        message = error.message;
      }

      setLoading(false);
      return { success: false, message };
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    role: 'youth' | 'employer';
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    try {
      setLoading(true);
      
      // Validate input
      if (!userData.email || !userData.password) {
        return { success: false, message: 'Email and password are required' };
      }
      
      if (userData.password.length < 8) {
        return { success: false, message: 'Password must be at least 8 characters long' };
      }
      
      // Check for network connectivity
      if (!navigator.onLine) {
        throw { code: 'NETWORK_ERROR', message: 'No internet connection. Please check your network.' };
      }
      
      try {
        // Register the user (do not auto-login)
        await authAPI.register(userData);
        toast.success('Registration successful! Please log in.');

        return { success: true, message: 'Registration successful! Please log in.' };

      } catch (apiError: any) {
        console.error('API Error during registration:', apiError);
        throw apiError; // Re-throw to be caught by outer catch
      }
      
    } catch (error: any) {
      console.error('Registration failed:', error);
      
      // Handle different types of errors
      let message = 'Registration failed. Please try again.';
      
      if (error.code === 'NETWORK_ERROR' || error.code === 'ERR_NETWORK' || !window.navigator.onLine) {
        message = 'Network error. Please check your internet connection.';
      } else if (error.response?.status === 409) {
        message = 'This email is already registered. Please use a different email or log in.';
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      
      return { success: false, message };
      
    } finally {
      setLoading(false);
    }
  };

  const authValue = {
    user,
    loading,
    login,
    register,
    logout: () => {
      authAPI.logout();
      setUser(null);
      navigate('/login');
    },
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployer: user?.role === 'employer',
    isYouth: user?.role === 'youth',
  };

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Create a protected route component
export const ProtectedRoute = ({
  children,
  roles,
}: {
  children: ReactNode | ((props: { user: User }) => ReactNode);
  roles?: ('admin' | 'employer' | 'youth')[];
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (roles && !roles.includes(user.role as any)) {
    // Redirect to unauthorized or home page
    return <Navigate to="/unauthorized" replace />;
  }

  // If children is a function, pass the user to it
  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }

  return <>{children}</>;
};