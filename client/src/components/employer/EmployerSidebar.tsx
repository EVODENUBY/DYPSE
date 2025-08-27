import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import type { User } from '@/contexts/AuthContext';

// Define local type aliases for better type safety
type YouthUser = {
  role: 'youth';
  firstName?: string;
  lastName?: string;
  email?: string;
  [key: string]: any;
};

type EmployerUser = {
  role: 'employer';
  companyName?: string;
  contactName?: string;
  email?: string;
  [key: string]: any;
};

import { 
  FiSettings, 
  FiChevronLeft, 
  FiChevronRight,
  FiDollarSign,
  FiBarChart2,
  FiUser,
  FiUsers,
  FiBriefcase,
  FiLogOut,
  FiActivity,
  FiFileText,
  FiCheckCircle,
  FiHome,
  FiBell
} from 'react-icons/fi';
import { FaSearchLocation } from 'react-icons/fa';

interface NavItem {
  name: string;
  icon: React.ReactNode;
  path: string;
  children?: NavItem[];
}

interface EmployerSidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

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

const EmployerSidebar: React.FC<EmployerSidebarProps> = ({ isCollapsed, onToggleSidebar }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      icon: <FiHome className="h-5 w-5" />, 
      path: '/employer/dashboard' 
    },
    { 
      name: 'Employer Profiles', 
      icon: <FiUser className="h-5 w-5" />, 
      path: '/employer/profile' 
    },
    { 
      name: 'Record Business Type', 
      icon: <FiFileText className="h-5 w-5" />, 
      path: '/employer/record-business' 
    },
    { 
      name: 'Analytics', 
      icon: <FiBarChart2 className="h-5 w-5" />, 
      path: '/employer/analytics' 
    },
    { 
      name: 'Location Map', 
      icon: <FaSearchLocation className="h-5 w-5" />, 
      path: '/employer/location-map' 
    },
    { 
      name: 'Add Revenue', 
      icon: <FiDollarSign className="h-5 w-5" />, 
      path: '/employer/add-revenue' 
    },
    { 
      name: 'Support Needs', 
      icon: <FiActivity className="h-5 w-5" />, 
      path: '/employer/support-needs' 
    },
    { 
      name: 'Groups', 
      icon: <FiUsers className="h-5 w-5" />, 
      path: '/employer/groups' 
    },
    { 
      name: 'Opportunities', 
      icon: <FiBriefcase className="h-5 w-5" />, 
      path: '/employer/opportunities' 
    },
    { 
      name: 'Training Centers', 
      icon: <FiCheckCircle className="h-5 w-5" />, 
      path: '/employer/training-centers' 
    },
    { 
      name: 'Notifications', 
      icon: <FiBell className="h-5 w-5" />, 
      path: '/employer/notifications' 
    },

    
    { 
      name: 'Settings', 
      icon: <FiSettings className="h-5 w-5" />, 
      path: '/employer/settings' 
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Close sidebar on mobile when a link is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 768) { // md breakpoint
      onToggleSidebar();
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-[#0033FF] to-[#000333DD] text-white">
      {/* Welcome Message - Only show when not collapsed */}
      {!isCollapsed && (
        <div className="p-4 bg-blue-700">
          <div className="flex items-center">
            <div className="bg-white bg-opacity-20 p-2 rounded-full">
              <div className="h-6 w-6 flex items-center justify-center text-white font-medium">
                {getUserInitials(user)}
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium">Welcome back,</p>
              <p className="text-lg font-bold">{getUserDisplayName(user)}</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Logo */}
      <div className="flex items-center justify-between p-4 border-b border-blue-700">
        {!isCollapsed && (
          <Link to="/employer/dashboard" className="flex items-center">
            <span className="text-white text-xl font-bold">DYPSE</span>
            
          </Link>
        )}
        <button
          onClick={onToggleSidebar}
          className="text-blue-200 hover:text-white p-1 rounded-full hover:bg-blue-500 transition-colors duration-200"
        >
          {isCollapsed ? (
            <FiChevronRight className="h-5 w-5" />
          ) : (
            <FiChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          {!isCollapsed ? 'Main Menu' : '•'}
        </div>
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                onClick={handleLinkClick}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-200
                    ${
                    isActive(item.path)
                      ? 'bg-blue-700 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:bg-opacity-50 hover:text-white'
                  }
                `}
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!isCollapsed && <span className="ml-3">{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className={`p-4 border-t border-blue-500 border-opacity-20 ${isCollapsed ? 'text-center' : ''}`}>
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-400 flex items-center justify-center text-white font-medium">
              {getUserInitials(user)}
            </div>
          </div>
          {!isCollapsed && (
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">{getUserDisplayName(user)}</p>
              <p className="text-xs text-blue-200 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        
        {!isCollapsed && (
          <div className="mt-3 flex space-x-2">
            <Link
              to="/employer/profile"
              className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs rounded-md text-blue-200 hover:bg-blue-700 hover:bg-opacity-50"
            >
              <FiUser className="h-4 w-4 mr-1" />
              Profile
            </Link>
            <button
              className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs rounded-md text-blue-200 hover:bg-blue-700 hover:bg-opacity-50"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              <FiLogOut className="h-4 w-4 mr-1" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerSidebar;
