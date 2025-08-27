import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-[#D9D9D9] border-t border-gray-200 mt-8">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DYPSE. All rights reserved.
          </div>
          <div className="mt-4 md:mt-0">
            <nav className="flex space-x-6">
              <Link to="/privacy" className="text-sm text-gray-500 hover:text-gray-700">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm text-gray-500 hover:text-gray-700">
                Terms of Service
              </Link>
              <Link to="/contact" className="text-sm text-gray-500 hover:text-gray-700">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
