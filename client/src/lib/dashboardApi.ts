import api, { ApiError } from './api';

export interface DashboardStats {
  totalYouths: number;
  previousMonthYouths: number;
  totalEmployers: number;
  previousMonthEmployers: number;
  unemploymentRate: number;
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
};

export default dashboardApi;


