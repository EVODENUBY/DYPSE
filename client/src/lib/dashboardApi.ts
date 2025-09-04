import api, { ApiError } from './api';

export interface DashboardStats {
  totalYouths: number;
  previousMonthYouths: number;
  totalEmployers: number;
  previousMonthEmployers: number;
  unemploymentRate: number;
  activeJobs?: number;
  totalApplications?: number;
  newApplicationsThisMonth?: number;
}

// Normalize various possible server payloads into DashboardStats
function normalizeStats(payload: any): DashboardStats {
  const data = payload?.data ?? payload ?? {};

  return {
    totalYouths: Number(data.totalYouths ?? data.youthsTotal ?? 0) || 0,
    previousMonthYouths: Number(data.previousMonthYouths ?? data.youthsPrevMonth ?? 0) || 0,
    totalEmployers: Number(data.totalEmployers ?? data.employersTotal ?? 0) || 0,
    previousMonthEmployers: Number(data.previousMonthEmployers ?? data.employersPrevMonth ?? 0) || 0,
    unemploymentRate: Number(data.unemploymentRate ?? data.unemployment ?? 0) || 0,
  };
}

export const dashboardApi = {
  async getDashboardStats(): Promise<{ success: boolean; message?: string; data?: DashboardStats }> {
    try {
      const response = await api.get<any>('/admin/dashboard-stats');

      // Accept either { success, data } or raw stats
      const success = Boolean(response.data?.success ?? true);
      const message = response.data?.message;
      const normalized = normalizeStats(response.data?.data ?? response.data);

      return { success, message, data: normalized };
    } catch (error: any) {
      // If endpoint missing or unauthorized, return safe defaults but mark success=false
      if (error?.response?.status === 404 || error?.response?.status === 401) {
        return { success: false, message: error.response?.data?.message || 'Dashboard stats unavailable', data: normalizeStats({}) };
      }

      if (error instanceof ApiError) return { success: false, message: error.message, data: normalizeStats({}) };

      return { success: false, message: 'Failed to fetch dashboard stats', data: normalizeStats({}) };
    }
  },

  async getEmployerDashboardStats(): Promise<{ success: boolean; message?: string; data?: DashboardStats }> {
    try {
      const response = await api.get<any>('/employer/dashboard-stats');

      // Accept either { success, data } or raw stats
      const success = Boolean(response.data?.success ?? true);
      const message = response.data?.message;
      const data = response.data?.data ?? response.data;

      // Normalize the data to match the DashboardStats interface
      const normalized = {
        totalYouths: data?.totalYouths || 0,
        previousMonthYouths: data?.previousMonthYouths || 0,
        totalEmployers: 0, // Not used in employer dashboard
        previousMonthEmployers: 0, // Not used in employer dashboard
        unemploymentRate: data?.unemploymentRate || 0,
        activeJobs: data?.activeJobs || 0,
        totalApplications: data?.totalApplications || 0,
        newApplicationsThisMonth: data?.newApplicationsThisMonth || 0
      };

      return { success, message, data: normalized };
    } catch (error: any) {
      console.error('Error fetching employer dashboard stats:', error);
      
      // For 403, don't show an error message since we'll use fallback data
      if (error?.response?.status !== 403) {
        return { 
          success: false, 
          message: error.response?.data?.message || 'Failed to fetch employer dashboard stats', 
          data: normalizeStats({}) 
        };
      }
      
      return { success: false, message: 'Access denied', data: normalizeStats({}) };
    }
  },
};

export default dashboardApi;


