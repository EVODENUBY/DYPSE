import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon ,ArrowLeftIcon} from '@heroicons/react/24/outline';
import { useNotifications } from '../../contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationsPage: React.FC = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();

  // Mark all notifications as read when the page loads
  useEffect(() => {
    markAllAsRead();
  }, [markAllAsRead]);

  // Filter notifications for youth users
  const youthNotifications = notifications.filter(
    notification => notification.target === 'all' || notification.target === 'youths'
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Link to="/youth/dashboard" className="mr-4 text-gray-500 hover:text-gray-700">
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
        <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className="text-sm font-medium text-blue-600 hover:text-blue-800"
          disabled={youthNotifications.every(n => n.read)}
        >
          Mark all as read
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg divide-y divide-gray-200">
        {youthNotifications.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
            <p className="mt-2 text-sm font-medium text-gray-900">No notifications</p>
            <p className="mt-1 text-sm text-gray-500">You're all caught up! Check back later for updates.</p>
          </div>
        ) : (
          youthNotifications.map((notification) => (
            <div 
              key={notification.id}
              className={`px-6 py-4 hover:bg-gray-50 transition-colors duration-150 ${
                !notification.read ? 'bg-blue-50' : ''
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-1">
                  <BellIcon className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <span className="ml-2 text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.message}
                  </p>
                  <div className="mt-1 text-xs text-gray-500">
                    Sent to: {notification.target === 'all' ? 'All Users' : 'Youths'}
                  </div>
                </div>
                {!notification.read && (
                  <div className="ml-2 flex-shrink-0">
                    <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
