import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import YouthSidebar from './YouthSidebar';
import YouthNavbar from './YouthNavbar';
import YouthFooter from './YouthFooter';
import { Chatbot } from '../chatbot/Chatbot';

const YouthLayout: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On mobile, start with collapsed (icons only) by default
      if (mobile) {
        setIsSidebarCollapsed(true);
      } else {
        setIsSidebarCollapsed(false);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobile && 
        !isSidebarCollapsed && 
        sidebarRef.current && 
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setIsSidebarCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isSidebarCollapsed]);

  // Toggle sidebar with animation
  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div 
        ref={sidebarRef}
        className={`
          fixed md:relative z-30 h-full flex-shrink-0
          ${isSidebarCollapsed ? 'w-16' : 'w-64'} 
          transition-all duration-300 ease-in-out 
          bg-gradient-to-b from-blue-600 to-blue-700
          shadow-lg transform
          ${isMobile ? (isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0') : 'translate-x-0'}
        `}
      >
        <YouthSidebar 
          isCollapsed={isSidebarCollapsed} 
          onToggleSidebar={toggleSidebar}
        />
      </div>
      
      {/* Main Content */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${
        isMobile ? 'w-full' : ''
      }`}>
        {/* Navbar */}
        <div className="bg-white border-b border-gray-200 w-full">
          <YouthNavbar 
            onToggleSidebar={toggleSidebar}
          />
        </div>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-200 p-4 md:p-6 w-full">
          <div className="max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
        
        {/* Footer */}
        <div className="bg-white border-t border-gray-200 w-full">
          <YouthFooter />
        </div>
        
        {/* Chat Bot */}
        <Chatbot />
        
        {/* Mobile overlay when sidebar is open */}
        {!isSidebarCollapsed && isMobile && (
          <div 
            className="md:hidden fixed inset-0 bg-black/50 z-20"
            onClick={() => setIsSidebarCollapsed(true)}
          />
        )}
      </div>
    </div>
  );
};

export default YouthLayout;
