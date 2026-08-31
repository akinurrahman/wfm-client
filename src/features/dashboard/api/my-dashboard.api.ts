import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse } from '@/lib/api/types';

import type { DashboardFilters } from '../definitions/dashboard.types';
import type { MyDashboard } from '../definitions/my-dashboard.types';

export const myDashboardApi = {
  getBoard: (filters: DashboardFilters, signal?: AbortSignal) =>
    apiCall<ApiResponse<MyDashboard>>('/dashboard/me', {
      params: filters,
      signal,
      version: 'root',
    }),
};
