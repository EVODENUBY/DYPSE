import api from '@/lib/api';

export interface YouthSkillDto {
  skillId: string;
  level: 'beginner' | 'intermediate' | 'expert';
  yearsExperience?: number;
}

export const profileAPI = {
  getMyProfile: async () => {
    const res = await api.get('/profiles/me');
    return res.data;
  },
  updateMyProfile: async (payload: any) => {
    const res = await api.put('/profiles/me', payload);
    return res.data;
  },
  uploadProfilePicture: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await api.post('/uploads/profile-picture', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data as { url: string; profile: any };
  },
  uploadCv: async (file: File) => {
    const form = new FormData();
    form.append('file', file);
    const res = await api.post('/uploads/cv', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data as { id: string; fileUrl: string };
  },
  // Skills helpers
  getMySkills: async () => {
    const res = await api.get('/profiles/me/skills');
    return res.data as any[];
  },
  upsertSkill: async (payload: YouthSkillDto) => {
    const res = await api.post('/profiles/me/skills', payload);
    return res.data;
  },
  deleteSkill: async (skillId: string) => {
    await api.delete(`/profiles/me/skills/${skillId}`);
  },
  searchSkills: async (q: string) => {
    const res = await api.get('/skills', { params: { q } });
    return res.data as Array<{ id: string; name: string }>;
  },
  // Experience
  addExperience: async (payload: {
    employerName: string;
    role: string;
    startDate?: string;
    endDate?: string;
    description?: string;
    isCurrent?: boolean;
  }) => {
    const res = await api.post('/experiences/me', payload);
    return res.data;
  },
  updateExperience: async (id: string, payload: Partial<{
    employerName: string;
    role: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrent: boolean;
  }>) => {
    const res = await api.put(`/experiences/${id}`, payload);
    return res.data;
  },
  deleteExperience: async (id: string) => {
    await api.delete(`/experiences/${id}`);
  },
  // Education
  addEducation: async (payload: {
    school: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const res = await api.post('/educations/me', payload);
    return res.data;
  },
  updateEducation: async (id: string, payload: Partial<{
    school: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
  }>) => {
    const res = await api.put(`/educations/${id}`, payload);
    return res.data;
  },
  deleteEducation: async (id: string) => {
    await api.delete(`/educations/${id}`);
  },
};

