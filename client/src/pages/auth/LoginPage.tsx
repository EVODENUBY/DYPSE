import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Card, CardHeader, CardDescription, CardContent } from '@/components/ui/Card';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { primaryGradient } from '@/theme';
import { NavBar } from '@/components/layout/NavBar';
import { Chatbot } from '@/components/chatbot/Chatbot';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { NetworkError, ApiError } from '@/lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  // Get email from URL params if coming from signup
  const searchParams = new URLSearchParams(window.location.search);
  const emailFromSignup = searchParams.get('email') || '';
  
  const [email, setEmail] = useState(emailFromSignup);
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [networkError, setNetworkError] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error states
    setError('');
    setNetworkError(false);
    
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }
    
    // Clear any previous errors
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      
      if (!result.success) {
        setError(result.message || 'Login failed. Please try again.');
      }
      //On success, AuthContext handles the redirect and success message
      
    } catch (err) {
      console.error('Login error:', err);
      
      let errorMessage = 'An unexpected error occurred. Please try again.';
      let isNetworkError = false;
      
      if (err instanceof NetworkError) {
        errorMessage = err.message;
        isNetworkError = true;
      } else if (err instanceof ApiError) {
        // Handle specific API error codes
        switch (err.code) {
          case 'INVALID_CREDENTIALS':
            errorMessage = 'Invalid email or password. Please try again.';
            break;
          case 'ACCOUNT_LOCKED':
            errorMessage = 'Your account has been locked. Please contact support.';
            break;
          case 'EMAIL_NOT_VERIFIED':
            errorMessage = 'Please verify your email before logging in.';
            break;
          default:
            errorMessage = err.message || 'An error occurred during login';
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setNetworkError(isNetworkError);
      
      // Only show toast for non-validation errors
      if (!errorMessage.includes('Please enter')) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    // TODO: Implement Google OAuth
    console.log('Google sign in clicked');
    toast('Google sign-in coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-700">Signing in, please wait...</p>
          </div>
        </div>
      )}
      <div className={`flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${primaryGradient} bg-cover bg-center`}>
        <div className="w-full max-w-md">
          <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-400">
              <h1 className="text-xl font-bold text-white text-center py-2">DYNAMIC YOUTH PROFILING SYSTEM</h1>
            </div>
            <CardHeader className="space-y-1 text-center pb-2">
              <CardDescription className="text-gray-600 font-semibold">
                For Every Youth, a Path. For Every Path, a Future
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoogleSignInButton 
                onClick={handleGoogleSignIn}
                text="Sign in with Google"
              />
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Or continue with email
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                {(error || networkError) && (
                  <div 
                    className={`rounded-md p-4 mb-4 ${
                      networkError 
                        ? 'bg-yellow-50 border-l-4 border-yellow-400' 
                        : 'bg-red-50 border-l-4 border-red-400'
                    }`}
                    role="alert"
                  >
                    <div className="flex">
                      <div className="flex-shrink-0">
                        {networkError ? (
                          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className={`text-sm ${networkError ? 'text-yellow-700' : 'text-red-700'}`}>
                          {error}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <div className="relative">
                  <label htmlFor="email" className="sr-only">
                    Email address
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className={`h-5 w-5 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    className={`pl-10 appearance-none relative block w-full px-3 py-2 border border-gray-400 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 sm:text-sm transition-colors`}
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      // Clear error when user starts typing
                      if (error) setError('');
                    }}
                    onFocus={() => {
                      // Clear error when user focuses on the input
                      if (error) setError('');
                    }}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    Password
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    className={`pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border  border-gray-400 ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-transparent'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 sm:text-sm transition-colors`}
                    placeholder="Password"
                    value={password}
                    disabled={isLoading}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      // Clear error when user starts typing
                      if (error) setError('');
                    }}
                    onFocus={() => {
                      // Clear error when user focuses on the input
                      if (error) setError('');
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <div className="text-sm">
                    <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner className="h-4 w-4 mr-2" />
                      Signing in...
                    </>
                  ) : 'Sign in'}
                </button>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                      to="/signup" 
                      className="ml-1 font-medium text-blue-600 hover:text-blue-500 hover:underline"
                    >
                      Sign up
                    </Link>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Chatbot />
    </div>
  );
}
