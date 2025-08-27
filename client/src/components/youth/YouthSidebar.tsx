import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  DocumentCheckIcon,
  Cog6ToothIcon as CogIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  BriefcaseIcon,
  ClipboardDocumentIcon as ClipboardIcon,
  BellIcon,
} from '@heroicons/react/24/outline';

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
}

interface YouthSidebarProps {
  isCollapsed: boolean;
  onToggleSidebar: () => void;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: HomeIcon, path: '/youth/dashboard' },
  { name: 'My Profile', icon: UserIcon, path: '/youth/profile' },
  { name: 'Find Jobs', icon: BriefcaseIcon, path: '/youth/jobs' },
  { name: 'Applications', icon: DocumentCheckIcon, path: '/youth/applications' },
  { name: 'Employers', icon: BriefcaseIcon, path: '/youth/employers' },
  { name: 'Trainings', icon: DocumentTextIcon, path: '/youth/trainings' },
  { name: 'Opportunities', icon: ClipboardIcon, path: '/youth/opportunities' },
  { name: 'Groups', icon: UserGroupIcon, path: '/youth/groups' },
  { name: 'Notifications', icon: BellIcon, path: '/youth/notifications' },
];

const bottomNavItems: NavItem[] = [
  { name: 'Settings', icon: CogIcon, path: '/youth/settings' },
  { name: 'Help & Support', icon: QuestionMarkCircleIcon, path: '/youth/help' },
];

const YouthSidebar: React.FC<YouthSidebarProps> = ({ isCollapsed, onToggleSidebar }) => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname.startsWith(path);

  const handleNavItemClick = () => {
    // Close sidebar on mobile when a nav item is clicked
    if (window.innerWidth < 768) { 
      onToggleSidebar();
    }
  };

  const renderNavItem = (item: NavItem) => (
    <li key={item.path} className="mb-1">
      <Link
        to={item.path}
        onClick={handleNavItemClick}
        className={`flex items-center p-3 rounded-lg transition-colors ${
          isActive(item.path)
            ? 'bg-white/20 text-white font-medium shadow-md'
            : 'text-white/90 hover:bg-white/10'
        }`}
      >
        <item.icon className="h-5 w-5 flex-shrink-0" />
        {!isCollapsed && <span className="ml-3">{item.name}</span>}
      </Link>
    </li>
  );

  return (
    <div
      className={`h-screen bg-gradient-to-b from-[#0033FF] to-[#000333DD] text-white flex flex-col transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      <div className="p-4 flex justify-between items-center">
        <h1 className={`text-xl font-bold text-white ${isCollapsed ? 'hidden' : 'block'}`}>
          DYPSE
        </h1>
        <button 
          onClick={onToggleSidebar}
          className="md:hidden text-white hover:bg-white/20 p-1 rounded-md"
          aria-label="Toggle sidebar"
        >
          {isCollapsed ? (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          ) : (
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map(renderNavItem)}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/20 mt-auto">
        <ul className="space-y-1">
          {bottomNavItems.map(renderNavItem)}
        </ul>
      </div>
    </div>
  );
};

export default YouthSidebar;
