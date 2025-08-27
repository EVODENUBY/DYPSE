import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { NotificationBadge } from '@/components/common/NotificationBadge';
import { 
  BellIcon, 
  MagnifyingGlassIcon as SearchIcon, 
  ChevronDownIcon,
  UsersIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';


interface YouthNavbarProps {
  onToggleSidebar: () => void;
}

const YouthNavbar: React.FC<YouthNavbarProps> = ({ onToggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  
  const { user, logout } = useAuth();
  const { notifications, markAsRead } = useNotifications();
  const navigate = useNavigate();

  const youthNotifications = notifications.filter(
    notification => notification.target === 'all' || notification.target === 'youths'
  );
  
  const unreadCount = youthNotifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    const unreadIds = youthNotifications
      .filter(n => !n.read)
      .map(n => n.id);
    unreadIds.forEach(id => markAsRead(id));
  };
  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-[#D9D9D9] shadow-sm z-30 border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side - Toggle and Search */}
          <div className="flex items-center">
            <button
              type="button"
              className="p-2 rounded-md text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={onToggleSidebar}
            >
              <span className="sr-only">Toggle sidebar</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="ml-4 md:ml-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="search"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search..."
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Right side - User menu */}
          <div className="ml-4 flex items-center md:ml-6">
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                className="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <span className="sr-only">View notifications</span>
                <BellIcon className="h-6 w-6" aria-hidden="true" />
                <NotificationBadge count={unreadCount} className="absolute -top-1 -right-1" />
              </button>
              
              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                  <div className="p-2 border-b border-gray-200 bg-gray-50 rounded-t-md">
                    <div className="flex justify-between items-center px-2 py-1">
                      <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                      {unreadCount > 0 && (
                        <button
                          onClick={handleMarkAllAsRead}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          Mark all as read
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {youthNotifications.length > 0 ? (
                      youthNotifications.map((notification) => {
                        const Icon = notification.target === 'all' ? UsersIcon : UserGroupIcon;
                        const iconColor = notification.target === 'all' ? 'text-blue-500' : 'text-green-500';
                        
                        return (
                          <Link
                            key={notification.id}
                            to="/youth/notifications"
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
                  <div className="border-t border-gray-100 bg-gray-50 text-center rounded-b-md">
                    <Link
                      to="/youth/notifications"
                      className="block py-2 text-sm font-medium text-blue-600 hover:bg-gray-100"
                      onClick={() => setShowNotifications(false)}
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

              <div className="ml-3 relative" ref={profileRef}>
                <div>
                  <button
                    type="button"
                    className="max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 hover:bg-blue-50 px-2 py-1 transition-colors duration-150"
                    id="user-menu-button"
                    aria-expanded={isProfileOpen}
                    aria-haspopup="true"
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                  >
                    <span className="sr-only">Open user menu</span>
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-medium">
                      {user ? getInitials(`${user.firstName} ${user.lastName}`) : 'U'}
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                      {user ? `${user.firstName} ${user.lastName}` : 'User'}
                    </span>
                    <ChevronDownIcon className="ml-1 h-4 w-4 text-gray-500 hidden md:block" />
                  </button>
                </div>

                {isProfileOpen && (
                  <div
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                    onMouseEnter={() => setIsProfileOpen(true)}
                    onMouseLeave={() => setIsProfileOpen(false)}
                  >
                    <Link
                    to="/youth/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Your Profile
                    </div>
                  </Link>
                  <Link
                    to="/youth/applications"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-0.5"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      My Applications
                    </div>
                  </Link>
                  <Link
                    to="/youth/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors duration-150"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-1"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      Settings
                    </div>
                  </Link>
                  <div className="border-t border-gray-100 my-1"></div>
                  <button
                    onClick={() => {
                      logout();
                      navigate('/login');
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 flex items-center"
                    role="menuitem"
                    tabIndex={-1}
                    id="user-menu-item-2"
                  >
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign out
                  </button>
                  </div>
                )}
              </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default YouthNavbar;
