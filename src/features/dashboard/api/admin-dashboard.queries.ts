import { useQuery } from '@tanstack/react-query';

import { ADMIN_DASHBOARD_KEYS } from '../definitions/admin-dashboard.constants';
import type { AdminDashboardFilters } from '../definitions/dashboard.types';
import { adminDashboardApi } from './admin-dashboard.api';

export function useAdminDashboard(filters: AdminDashboardFilters) {
  return useQuery({
    queryKey: ADMIN_DASHBOARD_KEYS.board(filters),
    queryFn: ({ signal }) => adminDashboardApi.getBoard(filters, signal),
    placeholderData: prev => prev,
  });
}
