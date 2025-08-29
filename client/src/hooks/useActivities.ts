import { useState, useEffect, useCallback } from 'react';
import { type UserActivity } from '@/lib/activitiesApi';
import { type FormattedActivity, formatActivitiesForDisplay } from '@/lib/activityUtils';
import { profileAPI } from '@/lib/profileApi';

interface UseActivitiesOptions {
  limit?: number;
  types?: string[];
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseActivitiesReturn {
  activities: FormattedActivity[];
  rawActivities: UserActivity[];
  loading: boolean;
  error: string | null;
  refreshActivities: () => Promise<void>;
  hasMoreActivities: boolean;
}

export const useActivities = (options: UseActivitiesOptions = {}): UseActivitiesReturn => {
  const {
    limit = 10,
    types,
    autoRefresh = false,
    refreshInterval = 30000 // 30 seconds
  } = options;

  const [activities, setActivities] = useState<FormattedActivity[]>([]);
  const [rawActivities, setRawActivities] = useState<UserActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreActivities, setHasMoreActivities] = useState(false);

  const refreshActivities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch slightly more than the limit to check if there are more activities
      const fetchLimit = limit + 1;
      const fetchedActivities = await profileAPI.getRecentActivities({ 
        limit: fetchLimit, 
        types 
      });

      // Check if we have more activities than the limit
      const hasMore = fetchedActivities.length > limit;
      const activitiesToShow = hasMore ? fetchedActivities.slice(0, limit) : fetchedActivities;
      
      setRawActivities(activitiesToShow);
      setActivities(formatActivitiesForDisplay(activitiesToShow));
      setHasMoreActivities(hasMore);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setError('Failed to load activities');
      setActivities([]);
      setRawActivities([]);
    } finally {
      setLoading(false);
    }
  }, [limit, types]);

  // Initial load
  useEffect(() => {
    refreshActivities();
  }, [refreshActivities]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(refreshActivities, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshActivities]);

  return {
    activities,
    rawActivities,
    loading,
    error,
    refreshActivities,
    hasMoreActivities
  };
};

// Hook specifically for dashboard activities
export const useDashboardActivities = () => {
  return useActivities({
    limit: 8,
    autoRefresh: false // Dashboard will refresh manually when needed
  });
};

// Hook specifically for profile-related activities
export const useProfileActivities = () => {
  return useActivities({
    limit: 10,
    types: [
      'profile_update',
      'profile_picture_upload',
      'cv_upload',
      'skill_add',
      'skill_remove',
      'experience_add',
      'experience_update',
      'experience_delete',
      'education_add',
      'education_update',
      'education_delete'
    ],
    autoRefresh: false
  });
};

export default useActivities;
