import React, { useState, useEffect } from 'react';
import { FiUsers, FiUser, FiUserCheck, FiSend, FiBell, FiAlertCircle } from 'react-icons/fi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow, isAfter } from 'date-fns';

interface NotificationForm {
  title: string;
  message: string;
  target: 'all' | 'employers' | 'youths';
  scheduledFor: Date;
}

interface NotificationFormErrors {
  title?: string;
  message?: string;
  scheduledFor?: string;
}



const AdminNotificationsPage: React.FC = () => {
  const { addNotification, notifications, markAllAsRead } = useNotifications();
  
  const [formData, setFormData] = useState<NotificationForm>({
    title: '',
    message: '',
    target: 'all',
    scheduledFor: new Date(),
  });
  
  const [errors, setErrors] = useState<NotificationFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'create' | 'history'>('create');

  // Mark all notifications as read when the page loads
  useEffect(() => {
    if (notifications.some(n => !n.read)) {
      markAllAsRead();
    }
  }, [markAllAsRead, notifications]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Type-safe way to update form data
    if (name === 'title' || name === 'message' || name === 'target') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value 
      }));
    }
    
    // Clear error when user types
    if (errors[name as keyof NotificationFormErrors]) {
      setErrors(prev => ({ 
        ...prev, 
        [name as keyof NotificationFormErrors]: undefined 
      }));
    }
  };

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setFormData(prev => ({
        ...prev,
        scheduledFor: date
      }));
      if (errors.scheduledFor) {
        setErrors(prev => ({
          ...prev,
          scheduledFor: undefined
        }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: NotificationFormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title is too long (max 100 characters)';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message is too long (max 1000 characters)';
    }
    
    if (!formData.scheduledFor) {
      newErrors.scheduledFor = 'Scheduled date is required';
    } else if (isAfter(new Date(), formData.scheduledFor)) {
      newErrors.scheduledFor = 'Scheduled date must be in the future';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you would make an API call here
      await new Promise(resolve => setTimeout(resolve, 500));
      
      addNotification({
        title: formData.title,
        message: formData.message,
        target: formData.target,
        scheduledFor: formData.scheduledFor,
      });
      
      // Reset form
      setFormData({ 
        title: '', 
        message: '', 
        target: 'all', 
        scheduledFor: new Date() 
      });
      
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
      
    } catch (error) {
      console.error('Failed to send notification', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTimeAgo = (date: Date): string => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const formatDateTime = (date: Date): string => {
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Create Notification Form */}
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Create Notification</h2>
              {submitSuccess && (
                <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                  Notification sent successfully!
                </span>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter notification title"
                  maxLength={100}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <FiAlertCircle className="mr-1" /> {errors.title}
                  </p>
                )}
              </div>
              {/* Message Field */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className={`w-full p-2 border rounded-md ${
                    errors.message ? 'border-red-500' : 'border-gray-300'
                  } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  placeholder="Enter notification message"
                  maxLength={1000}
                />
                <div className="flex justify-between mt-1">
                  {errors.message ? (
                    <p className="text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" /> {errors.message}
                    </p>
                  ) : (
                    <div className="text-xs text-gray-500">
                      {formData.message.length}/1000 characters
                    </div>
                  )}
                </div>
              </div>

              {/* Date & Target Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="scheduledFor" className="block text-sm font-medium text-gray-700 mb-1">
                    Scheduled Date & Time <span className="text-red-500">*</span>
                  </label>
                  <DatePicker
                    id="scheduledFor"
                    selected={formData.scheduledFor}
                    onChange={handleDateChange}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    dateFormat="MMMM d, yyyy h:mm aa"
                    className={`w-full p-2 border rounded-md ${
                      errors.scheduledFor ? 'border-red-500' : 'border-gray-300'
                    } focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                    minDate={new Date()}
                  />
                  {errors.scheduledFor && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <FiAlertCircle className="mr-1" /> {errors.scheduledFor}
                    </p>
                  )}
                </div>
                
                <div>
                  <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
                    Target Audience <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="target"
                    name="target"
                    value={formData.target}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    <option value="employers">Employers Only</option>
                    <option value="youths">Youths Only</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 px-4 rounded-md flex items-center justify-center ${
                    isSubmitting
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700'
                  } text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <FiSend className="mr-2" />
                      Send Notification
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Recent Notifications</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
                  </span>
                </div>
              </div>
              
              {/* Tabs */}
              <div className="mt-4 flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('create')}
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'create'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  New Notification
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`py-2 px-4 font-medium text-sm ${
                    activeTab === 'history'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Notification History
                </button>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200 max-h-[calc(100vh-250px)] overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((note) => (
                  <div 
                    key={note.id}
                    className={`p-4 hover:bg-gray-50 transition-colors duration-150 ${
                      !note.read ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 pt-0.5">
                        <div className={`h-9 w-9 rounded-full flex items-center justify-center ${
                          note.target === 'all' ? 'bg-blue-100 text-blue-600' :
                          note.target === 'employers' ? 'bg-purple-100 text-purple-600' :
                          'bg-green-100 text-green-600'
                        }`}>
                          {note.target === 'all' ? <FiUsers className="h-4 w-4" /> : 
                           note.target === 'employers' ? <FiUserCheck className="h-4 w-4" /> : 
                           <FiUser className="h-4 w-4" />}
                        </div>
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-medium text-gray-900 truncate pr-2">
                            {note.title}
                          </h3>
                          <div className="flex-shrink-0 flex items-center">
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(note.createdAt)}
                            </span>
                            {!note.read && (
                              <span className="ml-2 inline-block h-2 w-2 rounded-full bg-blue-500"></span>
                            )}
                          </div>
                        </div>
                        
                        <p className="mt-1 text-sm text-gray-600 whitespace-pre-line">{note.message}</p>
                        
                        <div className="mt-2 flex flex-wrap items-center text-xs text-gray-500 space-x-3">
                          <span className="inline-flex items-center">
                            {note.target === 'all' ? <FiUsers className="mr-1" /> : 
                             note.target === 'employers' ? <FiUserCheck className="mr-1" /> : 
                             <FiUser className="mr-1" />}
                            <span className="capitalize">
                              {note.target === 'all' ? 'All Users' : 
                               note.target === 'employers' ? 'Employers' : 'Youths'}
                            </span>
                          </span>
                          <span>•</span>
                          <span>Scheduled: {formatDateTime(note.scheduledFor)}</span>
                          <span>•</span>
                          <span>Status: {note.status}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 px-4">
                  <FiBell className="mx-auto h-12 w-12 text-gray-300" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Notifications you send will appear here.
                  </p>
                  <div className="mt-4">
                    <button
                      onClick={() => setActiveTab('create')}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <FiSend className="-ml-1 mr-2 h-4 w-4" />
                      Send your first notification
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {notifications.length > 0 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Showing {notifications.length} of {notifications.length} notifications
                </p>
                <button
                  type="button"
                  className="text-xs font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                  Back to top
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationsPage;
