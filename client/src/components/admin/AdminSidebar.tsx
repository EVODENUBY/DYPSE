import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  FiHome,
  FiUsers,
  FiSearch,
  FiBriefcase,
  FiUsers as FiUserGroup,
  FiBookOpen,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronLeft,
  FiChevronRight,
  FiBarChart2,
  FiMap,
  FiBell
} from 'react-icons/fi';

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isCollapsed, onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const menuItems = [
    { 
      name: 'Dashboard', 
      icon: <FiHome className="h-5 w-5" />, 
      path: '/admin/dashboard' 
    },
    { 
      name: 'Youth Profiles', 
      icon: <FiUsers className="h-5 w-5" />, 
      path: '/admin/youth-profiles' 
    },
    { 
      name: 'Search and Match', 
      icon: <FiSearch className="h-5 w-5" />, 
      path: '/admin/search-match' 
    },
    { 
      name: 'Analytics', 
      icon: <FiBarChart2 className="h-5 w-5" />, 
      path: '/admin/analytics' 
    },
    { 
      name: 'Location Map', 
      icon: <FiMap className="h-5 w-5" />, 
      path: '/admin/location-map' 
    },
    { 
      name: 'Employers', 
      icon: <FiBriefcase className="h-5 w-5" />, 
      path: '/admin/employers' 
    },
    { 
      name: 'Groups', 
      icon: <FiUserGroup className="h-5 w-5" />, 
      path: '/admin/groups' 
    },
    { 
      name: 'Opportunities', 
      icon: <FiBriefcase className="h-5 w-5" />, 
      path: '/admin/opportunities' 
    },
    { 
      name: 'Training Centers', 
      icon: <FiBookOpen className="h-5 w-5" />, 
      path: '/admin/training-centers' 
    },
    { 
      name: 'Notifications', 
      icon: <FiBell className="h-5 w-5" />, 
      path: '/admin/notifications' 
    },
    { 
      name: 'Settings', 
      icon: <FiSettings className="h-5 w-5" />, 
      path: '/admin/settings' 
    },
  ];

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0033FF] to-[#000333DD] text-white">

      {/* Welcome Message - Only shown when sidebar is expanded */}
      {!isCollapsed && user && (
        <div className="px-4 py-3 border-b border-indigo-600">
          <p className="text-sm text-indigo-200">Welcome back,</p>
          <p className="font-medium">{user.firstName || 'Admin'}</p>
        </div>
      )}
      {/* Toggle Button */}
      <div className="flex items-center justify-end h-16 px-4 border-b border-indigo-600">
        <button
          onClick={onToggleSidebar}
          className="text-white hover:bg-indigo-600 p-2 rounded-md focus:outline-none"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <FiChevronRight className="h-5 w-5" />
          ) : (
            <FiChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                location.pathname === item.path
                  ? 'bg-indigo-800 text-white'
                  : 'text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {!isCollapsed && item.name}
              {location.pathname === item.path && (
                <span className="ml-auto w-1 h-6 bg-white rounded-l-md"></span>
              )}
            </Link>
          ))}
        </nav>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-indigo-600">
        {!isCollapsed && user && (
          <div className="mb-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center mr-2">
                <FiUser className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium">{user.firstName || 'Admin'}</p>
                <p className="text-xs text-indigo-200 truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-2 py-2 text-sm font-medium text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75 rounded-md"
        >
          <FiLogOut className="h-5 w-5 mr-3" />
          {!isCollapsed && 'Logout'}
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
