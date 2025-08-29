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
  profile?: {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    profilePicture?: string;
    profileCompletion?: number;
    bio?: string;
    address?: string;
    city?: string;
    district?: string;
    country?: string;
    postalCode?: string;
    jobStatus?: string;
    skills?: any[];
    education?: any[];
    experience?: any[];
    cvUrl?: string;
    updatedAt?: string;
    [key: string]: any;
  };
  applications?: any[];
  interviews?: any[];
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
  refreshUser: () => Promise<void>;
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
      // Only attempt to load user if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await authAPI.getCurrentUser();
        
        // Validate required fields
        if (!userData?.id || !userData.email || !userData.role) {
          throw new Error('Invalid user data received from server');
        }

        // Ensure all required fields are present with proper types
        const user: User = {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          isEmailVerified: Boolean(userData.isEmailVerified),
          companyName: (userData as any).companyName,
          contactName: (userData as any).contactName,
          profile: userData.profile || {}
        };
        
        setUser(user);
      } catch (error) {
        console.error('Failed to load user:', error);
        // Clear invalid token
        localStorage.removeItem('token');
        // Don't show error toast here to prevent flash on page load
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to prevent flash of loading state
    const timer = setTimeout(() => {
      loadUser();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    // Don't set global loading state during login - let the component handle it
    // setLoading(true);
    
    try {
      // Basic validation
      if (!email?.trim()) {
        throw new Error('Please enter your email address');
      }
      
      if (!password) {
        throw new Error('Please enter your password');
      }
      
      // Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // Network check
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      // Attempt login - this will throw if login fails
      await authAPI.login({ email, password });
      
      // If we get here, login was successful - get the user data
      const userData = await authAPI.getCurrentUser();
      
      // Validate user data
      if (!userData?.id || !userData.email || !userData.role) {
        throw new Error('Invalid user data received from server');
      }
      
      const user: User = {
        id: userData.id,
        email: userData.email,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        phone: userData.phone || '',
        role: userData.role,
        isEmailVerified: Boolean(userData.isEmailVerified),
        companyName: (userData as any).companyName,
        contactName: (userData as any).contactName,
        profile: userData.profile || {}
      };

      // Update state
      setUser(user);
      
        // Show success message after a small delay to prevent flash
        setTimeout(() => {
          toast.success('Login successful!');
          
          // Check for redirect parameter in URL
          const urlParams = new URLSearchParams(window.location.search);
          const redirectParam = urlParams.get('redirect');
          
          let redirectPath;
          if (redirectParam) {
            // Use the redirect parameter from URL
            redirectPath = decodeURIComponent(redirectParam);
          } else {
            // Default redirect based on role
            redirectPath = {
              'admin': '/admin/dashboard',
              'employer': '/employer/dashboard',
              'youth': '/youth/dashboard',
              'verifier': '/verifier/dashboard'
            }[user.role] || '/dashboard';
          }
          
          navigate(redirectPath, { replace: true });
        }, 100);
      
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
      // Don't set global loading state during registration - let the component handle it
      // setLoading(true);
      
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
      // Don't reset global loading state
      // setLoading(false);
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await authAPI.getCurrentUser();
      
      if (userData?.id && userData.email && userData.role) {
        const user: User = {
          id: userData.id,
          email: userData.email,
          role: userData.role,
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          phone: userData.phone || '',
          isEmailVerified: Boolean(userData.isEmailVerified),
          companyName: (userData as any).companyName,
          contactName: (userData as any).contactName,
          profile: userData.profile || {}
        };
        setUser(user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Don't clear user on refresh error - just log it
    }
  };

  const logout = (): void => {
    try {
      authAPI.logout();
      setUser(null);
      // Clear any state that might be user-specific
      localStorage.removeItem('token');
      // Redirect to login with a state to show logout message
      navigate('/login', { 
        state: { 
          message: 'You have been successfully logged out.',
          messageType: 'success'
        } 
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Still clear user state even if logout API fails
      setUser(null);
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const authValue: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshUser,
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

export default AuthProvider;

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
  children: React.ReactNode | ((props: { user: User }) => React.ReactNode);
  roles?: ('admin' | 'employer' | 'youth' | 'verifier')[];
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    // Redirect to login page with the current location to return to after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if user has required role
  if (roles && roles.length > 0 && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // If children is a function, pass the user prop
  if (typeof children === 'function') {
    return <>{children({ user })}</>;
  }

  return <>{children}</>;
};
