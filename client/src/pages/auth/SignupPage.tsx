import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaExclamationCircle, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Card, CardHeader, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { GoogleSignInButton } from '@/components/auth/GoogleSignInButton';
import { primaryGradient } from '@/theme';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { NavBar } from '@/components/layout/NavBar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

export function SignupPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: 'youth' as const, // Default role
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions
    
    setError('');
    setSuccess(false);
    
    // Validate form
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setError('Please enter your full name');
      return;
    }
    
    if (!formData.email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }
    
    try {
      setLoading(true);
      
      const result = await register({
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone.trim(),
      });
      
      if (result?.success) {
        setSuccess(true);
        toast.success('Registration successful! Please check your email to verify your account.');
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          role: 'youth',
          password: '',
          confirmPassword: ''
        });
        setAgreedToTerms(false);
        
        // Redirect to login after a delay
        setTimeout(() => {
          navigate('/login', { 
            state: { 
              email: formData.email,
              registrationSuccess: true 
            } 
          });
        }, 1000);
      } else {
        const errorMsg = result?.message || 'Registration failed. Please try again.';
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (loading) return;
    
    setError('');
    setLoading(true);
    
    try {
      //Implement Google OAuth
      // For now, simulate a failure after a delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      throw new Error('Google Sign-In is not yet implemented');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to sign up with Google';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Google signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className={`flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 ${primaryGradient} bg-cover bg-center`}>
        <div className="w-full max-w-md">
          <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
            <div className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
              <h1 className="text-2xl font-bold text-white text-center py-2">DYPSE</h1>
            </div>
            <CardHeader className="space-y-1 text-center pb-2">
              <CardDescription className="text-gray-600">
                For every youth, a path. For every path, a future
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4 p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-start">
                  <FaExclamationCircle className="mt-0.5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success ? (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-md flex flex-col items-center text-center">
                  <FaCheckCircle className="h-8 w-8 text-green-500 mb-2" />
                  <h3 className="text-lg font-medium">Account created successfully!</h3>
                  <p className="mt-1 text-sm">Please check your email to verify your account.</p>
                  <Button
                    onClick={() => navigate('/login')}
                    className="mt-4"
                  >
                    Go to Login
                  </Button>
                </div>
              ) : (
                <>
                  <div className={loading ? 'opacity-70' : ''}>
                    <GoogleSignInButton 
                      onClick={handleGoogleSignIn}
                      text={loading ? 'Processing...' : 'Sign up with Google'}
                      className="w-full justify-center"
                    />
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with email</span>
                    </div>
                  </div>

                  <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                          First name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="firstName"
                            name="firstName"
                            type="text"
                            required
                            value={formData.firstName}
                            onChange={handleChange}
                            className={`pl-10 w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            placeholder="First name"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                          Last name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaUser className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="lastName"
                            name="lastName"
                            type="text"
                            required
                            value={formData.lastName}
                            onChange={handleChange}
                            className={`pl-10 w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            placeholder="Last name"
                            disabled={loading}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email address <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className={`pl-10 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            placeholder="Enter your email"
                            disabled={loading}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaPhone className="h-5 w-5 text-gray-400" />
                          </div>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className={`pl-10 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            placeholder="Enter your phone number"
                            disabled={loading}
                          />
                        </div>
                      </div>

                    </div>

                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        I am a <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        value={formData.role}
                        onChange={handleChange}
                        className="mt-1 block w-full pl-3 pr-10 py-2.5 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
                        disabled={loading}
                      >
                        <option value="youth">Job Seeker / Youth</option>
                        <option value="employer">Employer</option>
                      </select>
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={formData.password}
                          onChange={handleChange}
                          className="pl-10 pr-10 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                          placeholder="Create a password (min 8 characters)"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          )}
                        </button>
                      </div>
                      {formData.password && formData.password.length < 8 && (
                        <p className="mt-1 text-xs text-red-600">Password must be at least 8 characters</p>
                      )}
                    </div>

                    <div>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaLock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="pl-10 pr-10 w-full border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-md shadow-sm"
                          placeholder="Confirm your password"
                          disabled={loading}
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? (
                            <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          ) : (
                            <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                          )}
                        </button>
                      </div>
                      {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                        <p className="mt-1 text-xs text-red-600">Passwords do not match</p>
                      )}
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="terms"
                          name="terms"
                          type="checkbox"
                          required
                          checked={agreedToTerms}
                          onChange={(e) => setAgreedToTerms(e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="font-medium text-gray-700">
                          I agree to the{' '}
                          <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                            Terms of Service
                          </Link>{' '}
                          and{' '}
                          <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                            Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className={`w-full justify-center ${loading ? 'opacity-75' : ''}`}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <LoadingSpinner className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : 'Create Account'}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>
            
            <CardFooter className="flex justify-center py-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
      {/* Chatbot component removed from here - should be placed in a layout component if needed */}
    </div>
  );
}
