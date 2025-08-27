import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NavBar } from '@/components/layout/NavBar';
import { primaryGradient } from '@/theme';
import { Chatbot } from '@/components/chatbot/Chatbot';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  // Check if token is valid on component mount
  useEffect(() => {
    if (!token) {
      setTokenValid(false);
      setError('Invalid or missing reset token');
      return;
    }
    
    // In a real app, you might want to validate the token with the server
    setTokenValid(true);
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Invalid or expired reset link');
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    try {
      setIsLoading(true);
      
      // Call the API to reset the password
      await api.post('/auth/reset-password', {
        token,
        password
      });
      
      // Show success message
      toast.success('Your password has been reset successfully!', {
        duration: 5000,
        position: 'top-center',
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      const errorMessage = error.response?.data?.error || 'Failed to reset password. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className={`flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 ${primaryGradient} bg-cover bg-center`}>
          <div className="w-full max-w-md">
            <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
                <h1 className="text-2xl font-bold text-white text-center py-2">DYPSM</h1>
              </div>
              
              <CardHeader className="space-y-1 text-center pb-2">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
                  <FaExclamationTriangle className="h-8 w-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Invalid Link</h2>
                <CardDescription className="text-gray-600">
                  {error || 'This password reset link is invalid or has expired.'}
                </CardDescription>
              </CardHeader>

              <CardFooter className="justify-center text-sm text-gray-600 pt-4 border-t border-gray-100">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/forgot-password')} 
                  className="w-full"
                >
                  Request a new reset link
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className={`flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 ${primaryGradient} bg-cover bg-center`}>
          <div className="w-full max-w-md">
            <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
              <div className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
                <h1 className="text-2xl font-bold text-white text-center py-2">DYPSM</h1>
              </div>
              
              <CardHeader className="space-y-1 text-center pb-2">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                  <FaCheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Password Updated</h2>
                <CardDescription className="text-gray-600">
                  Your password has been successfully updated.
                </CardDescription>
              </CardHeader>

              <CardFooter className="justify-center text-sm text-gray-600 pt-4 border-t border-gray-100">
                <Button 
                  onClick={() => navigate('/login')} 
                  className="w-full"
                >
                  Back to Login
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className={`flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 ${primaryGradient} bg-cover bg-center`}>
        <div className="w-full max-w-md">
          <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
              <h1 className="text-2xl font-bold text-white text-center py-2">DYPSE</h1>
            </div>
            
            <CardHeader className="space-y-1 text-center pb-2">
              <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
              <CardDescription className="text-gray-600">
                {email ? `Reset password for ${email}` : 'Create a new password'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <label htmlFor="password" className="sr-only">
                    New Password
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    className={`pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="New password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
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

                <div className="relative">
                  <label htmlFor="confirm-password" className="sr-only">
                    Confirm New Password
                  </label>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    disabled={isLoading}
                    className={`pl-10 pr-10 appearance-none relative block w-full px-3 py-2 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (error) setError('');
                    }}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                    ) : (
                      <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                    )}
                  </button>
                </div>

                <div className="text-xs text-gray-500">
                  Password must be at least 8 characters long
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full ${isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Resetting...
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
}
