import React from 'react';
import { FiClock, FiActivity } from 'react-icons/fi';
import type { FormattedActivity } from '@/lib/activityUtils';

interface ActivityFeedProps {
  activities: FormattedActivity[];
  title?: string;
  showTitle?: boolean;
  maxItems?: number;
  className?: string;
  itemClassName?: string;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  title = 'Recent Activities',
  showTitle = true,
  maxItems,
  className = '',
  itemClassName = '',
  emptyMessage = 'No recent activities to show.',
  emptyIcon = <FiActivity className="w-6 h-6 text-gray-400" />
}) => {
  // Limit items if maxItems is specified
  const displayActivities = maxItems ? activities.slice(0, maxItems) : activities;

  return (
    <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
      {showTitle && (
        <h2 className="text-xl font-semibold mb-6">{title}</h2>
      )}
      
      <div className="space-y-4">
        {displayActivities.length > 0 ? (
          displayActivities.map((activity) => (
            <div 
              key={activity.id} 
              className={`flex items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0 ${itemClassName}`}
            >
              <div className="p-2 bg-gray-100 rounded-full mr-4 flex-shrink-0">
                {activity.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-800 text-sm sm:text-base">{activity.text}</p>
                <p className="text-xs sm:text-sm text-gray-500 flex items-center mt-1">
                  <FiClock className="w-3 h-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{activity.time}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <div className="p-3 bg-gray-100 rounded-full w-12 h-12 mx-auto mb-4">
              {emptyIcon}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Activities Yet</h3>
            <p className="text-gray-500 text-sm">{emptyMessage}</p>
          </div>
        )}
      </div>
      
      {maxItems && activities.length > maxItems && (
        <div className="mt-4 pt-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Showing {maxItems} of {activities.length} activities
          </p>
        </div>
      )}
    </div>
  );
};

// Compact version for smaller spaces
export const CompactActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  maxItems = 3,
  className = '',
  emptyMessage = 'No recent activities',
  ...props
}) => {
  return (
    <ActivityFeed
      {...props}
      activities={activities}
      showTitle={false}
      maxItems={maxItems}
      className={`p-4 ${className}`}
      itemClassName="pb-3"
      emptyMessage={emptyMessage}
      emptyIcon={<FiActivity className="w-4 h-4 text-gray-400" />}
    />
  );
};

export default ActivityFeed;
