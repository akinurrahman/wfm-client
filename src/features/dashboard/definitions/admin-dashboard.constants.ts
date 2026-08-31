import type { AdminDashboardFilters } from './dashboard.types';

export const ADMIN_DASHBOARD_KEYS = {
  all: ['dashboard', 'admin'] as const,
  boards: () => [...ADMIN_DASHBOARD_KEYS.all, 'board'] as const,
  board: (filters: AdminDashboardFilters) => [...ADMIN_DASHBOARD_KEYS.boards(), filters] as const,
};
