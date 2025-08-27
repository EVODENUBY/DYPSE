import React from 'react';

const YouthFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#D9D9D9] border-t border-gray-500 py-3">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            © {currentYear} DYPSE Dynamic Youth Profiling .  All rights reserved.
          </div>
          <div className="mt-2 md:mt-0">
            <nav className="flex items-center space-x-4">
              <a href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Privacy Policy
              </a>
              <span className="text-gray-300">•</span>
              <a href="/terms" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Terms of Service
              </a>
              <span className="text-gray-300">•</span>
              <a href="/contact" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                Contact Us
              </a>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default YouthFooter;
