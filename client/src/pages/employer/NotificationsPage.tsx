import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BellIcon,
  ArrowLeftIcon,
  UsersIcon,
  UserIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const EmployerNotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  // Mark all notifications as read when the page loads
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // Filter notifications for employers
  const employerNotifications = notifications.filter(
    notification => notification.target === 'all' || notification.target === 'employers'
  );

  const getNotificationIcon = () => {
    // Using a default icon since notification type isn't in the schema
    return <BellIcon className="h-5 w-5 text-blue-500" />;
  };

  const getTargetIcon = (target: string) => {
    switch (target) {
      case 'all':
        return <UsersIcon className="h-4 w-4 text-gray-400" />;
      case 'employers':
        return <UserGroupIcon className="h-4 w-4 text-blue-400" />;
      default:
        return <UserIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Link to="/employer/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>
        <button
          onClick={markAllAsRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
          disabled={employerNotifications.every(n => n.read)}
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
        {employerNotifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">No notifications</p>
            <p className="mt-1 text-sm text-gray-500">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          employerNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  {getNotificationIcon()}
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-gray-900">{notification.title}</h3>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                  <div className="mt-2 flex items-center text-xs text-gray-500">
                    <span className="flex items-center">
                      {getTargetIcon(notification.target)}
                      <span className="ml-1 capitalize">
                        {notification.target === 'all' ? 'All Users' : 'Employers'}
                      </span>
                    </span>
                    <span className="mx-2">•</span>
                    <span>Scheduled: {new Date(notification.scheduledFor).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployerNotificationsPage;
