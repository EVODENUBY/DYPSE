import React from 'react';

const AdminFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#D9D9D9] py-4 px-6 border-t border-gray-200">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="text-sm text-gray-600 mb-2 md:mb-0">
          © {currentYear} DYPSE Dynamic Youth Profiling System. All rights reserved.
        </div>
        <div className="flex items-center space-x-4">
          <a 
            href="/privacy" 
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Privacy Policy
          </a>
          <span className="text-gray-300">|</span>
          <a 
            href="/terms" 
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Terms of Service
          </a>
          <span className="text-gray-300">|</span>
          <a 
            href="/contact-us" 
            className="text-sm text-gray-600 hover:text-indigo-600 transition-colors"
          >
            Help Center
          </a>
        </div>
      </div>
    </footer>
  );
};

export default AdminFooter;
