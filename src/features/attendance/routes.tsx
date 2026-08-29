import type { RouteObject } from 'react-router';

export const attendanceRoutes: RouteObject[] = [
  {
    path: '/my-attendance',
    lazy: async () => ({
      Component: (await import('./pages/my-attendance/my-attendance-page')).default,
    }),
  },
  {
    path: '/attendance',
    lazy: async () => ({
      Component: (await import('./pages/roster/roster-page')).default,
    }),
  },
  {
    path: '/attendance/monthly',
    lazy: async () => ({
      Component: (await import('./pages/monthly/monthly-sheet-page')).default,
    }),
  },
  {
    path: '/attendance/periods',
    lazy: async () => ({
      Component: (await import('./pages/periods/period-list-page')).default,
    }),
  },
  {
    path: '/attendance/periods/:id/summary',
    lazy: async () => ({
      Component: (await import('./pages/periods/period-summary-page')).default,
    }),
  },
  {
    path: '/attendance/tools',
    lazy: async () => ({
      Component: (await import('./pages/tools/attendance-tools-page')).default,
    }),
  },
];
