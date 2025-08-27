import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiBell, FiMenu, FiUser, FiLogOut, FiChevronDown, FiMail, FiSettings } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ onToggleSidebar }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const displayName = (user?.firstName && `${user.firstName} ${user.lastName || ''}`.trim()) || (user?.email?.split('@')[0]) || 'Admin';

  return (
    <nav className="bg-[#D9D9D9] px-4 py-3 flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center">
        <div className="relative">
          <button
              type="button"
              className="text-gray-500 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 rounded-md p-2"
              onClick={onToggleSidebar}
            >
              <span className="sr-only">Open sidebar</span>
              <FiMenu className="h-6 w-6" aria-hidden="true" />
            </button>
        </div>
        <div className="ml-4 text-xl font-extrabold text-blue-800">DYPSE</div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Messages Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsMessagesOpen(!isMessagesOpen);
              setIsNotificationsOpen(false);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative"
          >
            <FiMail className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          {isMessagesOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Messages</h3>
              </div>
              <div className="py-1">
                <p className="text-center py-4 text-sm text-gray-500">No new messages</p>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
                <Link
                  to="/admin/messages"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all messages
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsMessagesOpen(false);
            }}
            className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none relative"
          >
            <FiBell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg overflow-hidden z-50">
              <div className="p-3 border-b border-gray-200">
                <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
              </div>
              <div className="py-1">
                <p className="text-center py-4 text-sm text-gray-500">No new notifications</p>
              </div>
              <div className="border-t border-gray-200 bg-gray-50 px-3 py-2">
                <Link
                  to="/admin/notifications"
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-500"
                >
                  View all notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative ml-3">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            id="user-menu"
            aria-expanded="false"
            aria-haspopup="true"
          >
            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
              <FiUser className="h-5 w-5" />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:inline">{displayName}</span>
            <FiChevronDown className="ml-1 h-4 w-4 text-gray-500" />
          </button>

          {isProfileOpen && (
            <div
              className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu"
            >
              <div className="py-1" role="none">
                <Link
                  to="/admin/profile"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <FiUser className="mr-3 h-5 w-5 text-gray-400" />
                  Your Profile
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <FiSettings className="mr-3 h-5 w-5 text-gray-400" />
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                >
                  <FiLogOut className="mr-3 h-5 w-5 text-gray-400" />
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;