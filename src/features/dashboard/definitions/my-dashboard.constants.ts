import type { DashboardFilters } from './dashboard.types';

export const MY_DASHBOARD_KEYS = {
  all: ['dashboard', 'me'] as const,
  boards: () => [...MY_DASHBOARD_KEYS.all, 'board'] as const,
  board: (filters: DashboardFilters) => [...MY_DASHBOARD_KEYS.boards(), filters] as const,
};
