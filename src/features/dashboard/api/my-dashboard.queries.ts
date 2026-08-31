import { useQuery } from '@tanstack/react-query';

import type { DashboardFilters } from '../definitions/dashboard.types';
import { MY_DASHBOARD_KEYS } from '../definitions/my-dashboard.constants';
import { myDashboardApi } from './my-dashboard.api';

export function useMyDashboard(filters: DashboardFilters) {
  return useQuery({
    queryKey: MY_DASHBOARD_KEYS.board(filters),
    queryFn: ({ signal }) => myDashboardApi.getBoard(filters, signal),
    placeholderData: prev => prev,
    retry: false,
  });
}
