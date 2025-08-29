import api from '@/lib/api';
import { activitiesAPI } from '@/lib/activitiesApi';

export interface YouthSkillDto {
  skillId: string;
  level: 'beginner' | 'intermediate' | 'expert';
  yearsExperience?: number;
}

export const profileAPI = {
  // Profile management
  getMyProfile: async () => {
    const res = await api.get('/profile/me');
    return res.data.data;
  },
  updateMyProfile: async (payload: any) => {
    const res = await api.put('/profile/me', payload);
    return res.data.data;
  },
  
  // File uploads
  uploadProfilePicture: async (file: File) => {
    const form = new FormData();
    form.append('profilePicture', file);
    const res = await api.post('/profile/upload/profile-picture', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  uploadCv: async (file: File) => {
    const form = new FormData();
    form.append('cv', file);
    const res = await api.post('/profile/upload/cv', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data.data;
  },
  // Skills helpers
  getMySkills: async () => {
    const res = await api.get('/profile/skills/me');
    return res.data.data;
  },
  upsertSkill: async (payload: YouthSkillDto) => {
    const res = await api.post('/profile/skills', payload);
    return res.data.data;
  },
  deleteSkill: async (skillId: string) => {
    const res = await api.delete(`/profile/skills/${skillId}`);
    return res.data;
  },
  searchSkills: async (q: string) => {
    const res = await api.get('/profile/skills/search', { params: { q } });
    return res.data.data;
  },
  createSkill: async (payload: { name: string; category: string; description?: string }) => {
    const res = await api.post('/profile/skills/create', payload);
    return res.data.data;
  },
  
  // Experience
  addExperience: async (payload: {
    employerName: string;
    role: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    isCurrent?: boolean;
    location?: string;
  }) => {
    const res = await api.post('/profile/experience', payload);
    return res.data.data;
  },
  updateExperience: async (id: string, payload: Partial<{
    employerName: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrent: boolean;
    location?: string;
  }>) => {
    const res = await api.put(`/profile/experience/${id}`, payload);
    return res.data.data;
  },
  deleteExperience: async (id: string) => {
    const res = await api.delete(`/profile/experience/${id}`);
    return res.data;
  },
  
  // Education
  addEducation: async (payload: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
  }) => {
    const res = await api.post('/profile/education', payload);
    return res.data.data;
  },
  updateEducation: async (id: string, payload: {
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate?: string;
  }) => {
    const res = await api.put(`/profile/education/${id}`, payload);
    return res.data.data;
  },
  deleteEducation: async (id: string) => {
    const res = await api.delete(`/profile/education/${id}`);
    return res.data;
  },
  
  // Analytics and Insights (new endpoints)
  getProfileInsights: async () => {
    const res = await api.get('/profile/insights');
    return res.data.data;
  },
  getProfileAnalytics: async () => {
    const res = await api.get('/profile/analytics');
    return res.data.data;
  },
  
  // Dashboard specific data endpoints
  getMyApplications: async () => {
    try {
      // This endpoint doesn't exist yet, so return empty array for now
      // TODO: Implement applications endpoint on backend
      return [];
    } catch (error) {
      console.warn('Applications endpoint not implemented yet');
      return [];
    }
  },
  
  getMyInterviews: async () => {
    try {
      // This endpoint doesn't exist yet, so return empty array for now
      // TODO: Implement interviews endpoint on backend
      return [];
    } catch (error) {
      console.warn('Interviews endpoint not implemented yet');
      return [];
    }
  },
  
  getRecentActivities: async (options?: {
    limit?: number;
    types?: string[];
  }) => {
    return activitiesAPI.getRecentActivities(options);
  },

  getActivityStats: async (options?: {
    days?: number;
  }) => {
    return activitiesAPI.getActivityStats(options);
  },
};

