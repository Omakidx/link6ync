import api from './client';
import type { AdminDashboardResponse } from '@/types';

// Get admin dashboard data
export const getAdminDashboard =
  async (): Promise<AdminDashboardResponse> => {
    const response =
      await api.get<AdminDashboardResponse>(
        '/admin/dashboard'
      );
    return response.data;
  };
