import React from 'react';
import { Link } from 'react-router-dom';

const EmployerFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#D9D9D9] border-t border-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start space-x-6">
            <Link to="/privacy" className="text-gray-500 hover:text-gray-700 text-sm">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-500 hover:text-gray-700 text-sm">
              Terms of Service
            </Link>
            <Link to="/contact-us" className="text-gray-500 hover:text-gray-700 text-sm">
              Help Center
            </Link>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-center text-sm text-gray-500">
              &copy; {currentYear} DYPSE. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EmployerFooter;
