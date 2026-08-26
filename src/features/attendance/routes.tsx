import type { RouteObject } from 'react-router';

export const attendanceRoutes: RouteObject[] = [
  {
    path: '/attendance',
    lazy: async () => ({
      Component: (await import('./pages/roster/roster-page')).default,
    }),
  },
  {
    path: '/attendance/tools',
    lazy: async () => ({
      Component: (await import('./pages/tools/attendance-tools-page')).default,
    }),
  },
];
