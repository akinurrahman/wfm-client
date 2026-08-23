import type { RouteObject } from 'react-router';

export const authRoutes: RouteObject[] = [
  {
    path: '/login',
    lazy: async () => ({
      Component: (await import('./pages/login-page')).default,
    }),
  },
];
