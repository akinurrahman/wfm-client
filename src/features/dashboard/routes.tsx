import type { RouteObject } from 'react-router';

export const dashboardRoutes: RouteObject[] = [
  {
    path: '/dashboard',
    lazy: async () => ({
      Component: (await import('./pages/admin/admin-dashboard-page')).default,
    }),
  },
  {
    path: '/my-dashboard',
    lazy: async () => ({
      Component: (await import('./pages/me/my-dashboard-page')).default,
    }),
  },
];
