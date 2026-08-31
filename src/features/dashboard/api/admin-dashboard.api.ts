import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse } from '@/lib/api/types';

import type { AdminDashboard } from '../definitions/admin-dashboard.types';
import type { AdminDashboardFilters } from '../definitions/dashboard.types';

export const adminDashboardApi = {
  getBoard: (filters: AdminDashboardFilters, signal?: AbortSignal) =>
    apiCall<ApiResponse<AdminDashboard>>('/dashboard/admin', {
      params: filters,
      signal,
      version: 'root',
    }),
};
