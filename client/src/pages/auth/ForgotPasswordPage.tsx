import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaArrowLeft, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { NavBar } from '@/components/layout/NavBar';
import { primaryGradient } from '@/theme';
import { Chatbot } from '@/components/chatbot/Chatbot';
import { toast } from 'react-hot-toast';
import  api  from '@/lib/api';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // Call the API to request password reset
      await api.post('/auth/request-password-reset', { email });
      
      // Show success message
      toast.success('Password reset link sent to your email!', {
        duration: 5000,
        position: 'top-center',
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      const errorMessage = error.response?.data?.error || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
         <NavBar />
         <div className={`flex items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8 ${primaryGradient} bg-cover bg-center`}>
           <div className="w-full max-w-md">
             <Card className="w-full bg-white/90 backdrop-blur-sm shadow-xl overflow-hidden">
               <div className="px-8 py-2 bg-gradient-to-r from-blue-600 to-purple-600">
                 <h1 className="text-2xl font-bold text-white text-center py-2">DYPSE</h1>
               </div>
               
            
            <CardHeader>
              <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
              <CardDescription className="text-gray-600">
                {isSubmitted
                  ? 'Check your email for further instructions.'
                  : 'Enter your email and we\'ll send you a link to reset your password.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-md bg-red-50 p-4 mb-4">
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
                    <label htmlFor="email" className="sr-only">
                      Email address
                    </label>
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className={`h-4 w-4 ${error ? 'text-red-400' : 'text-gray-400'}`} />
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      disabled={isLoading}
                      className={`pl-10 appearance-none relative block w-full px-3 py-2 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 sm:text-sm transition-colors`}
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError('');
                      }}
                    />
                  </div>

                  <div>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${isLoading ? 'bg-blue-400' : 'bg-gradient-to-r from-[#0033FF] to-[#000333DD] hover:bg-blue-700 focus:ring-blue-500'}`}
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                          Sending...
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                    <FaCheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>.
                    The link will expire in 1 hour.
                  </p>
                  <p className="text-xs text-gray-500 mb-6">
                    Didn't receive an email? Check your spam folder or{' '}
                    <button
                      onClick={() => {
                        setIsSubmitted(false);
                        setError('');
                      }}
                      className="text-blue-600 hover:text-blue-500 font-medium"
                    >
                      try again
                    </button>
                  </p>
                  <div className="mt-6">
                    <Button
                      variant="outline"
                      onClick={() => navigate('/login')}
                      className="w-full"
                    >
                      Back to login
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
                  <div className="text-sm text-center">
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/login')}
                      className="text-blue-600 hover:text-blue-500 flex items-center justify-center mx-auto"
                    >
                      <FaArrowLeft className="mr-1" /> Back to login
                    </Button>
                  </div>
          </Card>
        </div>
      </div>
      <Chatbot/>
    </div>
  );
}
