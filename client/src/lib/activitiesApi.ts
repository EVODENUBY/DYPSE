import api from '@/lib/api';

export interface UserActivity {
  id: string;
  activityType: 'profile_update' | 'profile_picture_upload' | 'cv_upload' | 'skill_add' | 'skill_remove' | 
                'experience_add' | 'experience_update' | 'experience_delete' |
                'education_add' | 'education_update' | 'education_delete' |
                'job_application' | 'job_bookmark' | 'training_enrollment' |
                'account_created' | 'profile_view' | 'login' | 'other';
  title: string;
  description?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface ActivityStats {
  [activityType: string]: number;
}

export const activitiesAPI = {
  // Get recent activities for the authenticated user
  getRecentActivities: async (options?: {
    limit?: number;
    types?: string[];
  }): Promise<UserActivity[]> => {
    try {
      const params = new URLSearchParams();
      
      if (options?.limit) {
        params.append('limit', options.limit.toString());
      }
      
      if (options?.types && options.types.length > 0) {
        params.append('types', options.types.join(','));
      }
      
      const url = `/activity/recent${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await api.get(url);
      
      return res.data.activities || [];
    } catch (error) {
      console.warn('Failed to fetch recent activities:', error);
      return [];
    }
  },

  // Get activity statistics for the authenticated user
  getActivityStats: async (options?: {
    days?: number;
  }): Promise<ActivityStats> => {
    try {
      const params = new URLSearchParams();
      
      if (options?.days) {
        params.append('days', options.days.toString());
      }
      
      const url = `/activity/stats${params.toString() ? `?${params.toString()}` : ''}`;
      const res = await api.get(url);
      
      return res.data.stats || {};
    } catch (error) {
      console.warn('Failed to fetch activity stats:', error);
      return {};
    }
  },
};
