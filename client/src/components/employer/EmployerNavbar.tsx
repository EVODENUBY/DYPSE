import React, { useState, useRef, useEffect } from 'react';
import { FiMenu, FiBell, FiSearch, FiChevronDown, FiUser, FiSettings, FiLogOut, FiUsers, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { useNavigate, Link } from 'react-router-dom';
import type { User } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import { NotificationBadge } from '@/components/common/NotificationBadge';

// Define local type aliases for better type safety
type YouthUser = {
  role: 'youth';
  firstName?: string;
  lastName?: string;
  [key: string]: any;
};

type EmployerUser = {
  role: 'employer';
  companyName?: string;
  contactName?: string;
  [key: string]: any;
};

interface EmployerNavbarProps {
  onToggleSidebar: () => void;
}

const EmployerNavbar: React.FC<EmployerNavbarProps> = ({ onToggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const { user, logout } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  // Filter notifications for employers
  const employerNotifications = notifications.filter(
    notification => notification.target === 'all' || notification.target === 'employers'
  );

  // Get unread count
  const unreadCount = employerNotifications.filter(n => !n.read).length;

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    const unreadIds = employerNotifications
      .filter(n => !n.read)
      .map(n => n.id);
    unreadIds.forEach(id => markAsRead(id));
  };

  // Type predicates with proper type narrowing
  function isYouth(user: any): user is YouthUser {
    return user?.role === 'youth';
  }
  
  function isEmployer(user: any): user is EmployerUser {
    return user?.role === 'employer';
  }
  
  // Get user display name with proper type checking
  const getUserDisplayName = (user: User | null): string => {
    if (!user) return 'User';
    
    if (isEmployer(user)) {
      return user.companyName || user.contactName || user.email?.split('@')[0] || 'User';
    }
    
    if (isYouth(user)) {
      const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
      return name || user.email?.split('@')[0] || 'User';
    }
    
    return user.email?.split('@')[0] || 'User';
  };
  
  // Get user initials with proper type checking
  const getUserInitials = (user: User | null): string => {
    if (!user) return 'U';
    
    if (isEmployer(user)) {
      const name = user.companyName || user.contactName || '';
      return name?.[0]?.toUpperCase() || 'U';
    }
    
    if (isYouth(user)) {
      const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
      return name?.[0]?.toUpperCase() || 'U';
    }
    
    return user.email?.[0]?.toUpperCase() || 'U';
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#D9D9D9] border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex items-center">
            <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md p-2"
              onClick={onToggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Desktop Search */}
            <div className="hidden md:block ml-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          {/* Mobile search */}
          {isMobileSearchOpen && (
            <div className="md:hidden absolute inset-x-0 top-16 bg-white p-4 z-10 shadow-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                  autoFocus
                />
                <button
                  onClick={() => setIsMobileSearchOpen(false)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close search</span>
                  <span className="text-xl">×</span>
                </button>
              </div>
            </div>
          )}

          {/* Right section */}
          <div className="flex items-center">
            {/* Mobile search button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={() => setIsMobileSearchOpen(true)}
            >
              <span className="sr-only">Search</span>
              <FiSearch className="h-6 w-6" aria-hidden="true" />
            </button>

                    {/* Notifications */}
            <div className="ml-4 relative" ref={notificationsRef}>
              <button
                type="button"
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              >
                <span className="sr-only">View notifications</span>
                <FiBell className="h-6 w-6" aria-hidden="true" />
                <NotificationBadge count={unreadCount} className="absolute -top-1 -right-1" />
              </button>

              {/* Notifications dropdown */}
              {isNotificationsOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                      <p className="text-sm font-medium text-gray-900">Notifications</p>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {employerNotifications.length > 0 ? (
                        employerNotifications.map((notification) => {
                          const Icon = notification.target === 'all' ? FiUsers : FiBriefcase;
                          const iconColor = notification.target === 'all' ? 'text-blue-500' : 'text-green-500';
                          
                          return (
                            <Link
                              key={notification.id}
                              to="/employer/notifications"
                              className={`block px-4 py-3 hover:bg-gray-50 ${
                                !notification.read ? 'bg-blue-50' : ''
                              }`}
                              onClick={() => markAsRead(notification.id)}
                            >
                              <div className="flex items-start">
                                <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>
                                  <Icon className="h-4 w-4" />
                                </div>
                                <div className="ml-3 flex-1">
                                  <div className="flex justify-between items-start">
                                    <p className="text-sm font-medium text-gray-900">
                                      {notification.title}
                                    </p>
                                    <span className="text-xs text-gray-400">
                                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                                  {!notification.read && (
                                    <span className="inline-block h-2 w-2 rounded-full bg-blue-500 mt-1"></span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <div className="px-4 py-3 text-center text-sm text-gray-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                    <div className="border-t border-gray-100">
                      <Link
                        to="/employer/notifications"
                        className="block px-4 py-2 text-sm font-medium text-center text-blue-600 hover:bg-gray-50"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div className="ml-4 relative" ref={profileRef}>
              <button
                type="button"
                className="max-w-xs  flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                id="user-menu"
                aria-expanded="false"
                aria-haspopup="true"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium text-sm">
                  {getUserInitials(user)}
                </div>
                <span className="hidden md:inline-block ml-2 text-sm font-medium text-gray-700">
                  {getUserDisplayName(user)}
                </span>
                <FiChevronDown className="hidden md:block ml-1 h-4 w-4 text-gray-500" />
              </button>

              {/* Profile dropdown menu */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                  <div className="py-1">
                    <a
                      href="/employer/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiUser className="mr-2 h-4 w-4" />
                      Your Profile
                    </a>
                    <a
                      href="#"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <FiSettings className="mr-2 h-4 w-4" />
                      Settings
                    </a>
                    <div className="border-t border-gray-100"></div>
                    <button
                      onClick={() => {
                        logout();
                        navigate('/login');
                      }}
                      className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FiLogOut className="mr-2 h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default EmployerNavbar;
