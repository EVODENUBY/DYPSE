import { Outlet, useLocation, Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/20/solid';

const SettingsPage = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Change Password', href: '/youth/settings/change-password' },
    { name: 'Email Preferences', href: '/youth/settings/email-preferences' },
  ];

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Handle account deletion
      console.log('Account deletion confirmed');
      // Add your account deletion logic here
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link to="/youth/profile" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Profile
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Settings</h1>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  location.pathname === item.href
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="px-6 py-6">
          <Outlet />
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg border border-red-200">
        <div className="px-6 py-5 border-b border-red-100">
          <h3 className="text-lg font-medium text-red-800">Danger Zone</h3>
          <p className="mt-1 text-sm text-red-600">
            These actions are irreversible. Please be certain.
          </p>
        </div>
        <div className="px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h4 className="text-base font-medium text-gray-900">Delete Account</h4>
              <p className="text-sm text-gray-500 mt-1">
                Permanently delete your account and all of your data.
              </p>
            </div>
            <button
              onClick={handleDeleteAccount}
              className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
