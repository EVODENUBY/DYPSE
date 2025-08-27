import api from './api';

export interface EmployerProfile {
  companyName: string;
  industry: string;
  companySize: string;
  foundedYear: string;
  city: string;
  country: string;
  website: string;
  description: string;
  taxId: string;
  businessRegistrationNumber: string;
  logoUrl?: string;
}

export const employerApi = {
  // Get employer profile
  getProfile: async (): Promise<EmployerProfile> => {
    const response = await api.get('/employer/profile');
    return response.data;
  },

  // Update employer profile
  updateProfile: async (data: Partial<EmployerProfile>): Promise<EmployerProfile> => {
    const response = await api.put('/employer/profile', data);
    return response.data;
  },

  // Upload logo
  uploadLogo: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('logo', file);
    
    const response = await api.post('/employer/upload/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  }
};

export default employerApi;
