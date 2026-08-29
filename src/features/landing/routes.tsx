import type { RouteObject } from 'react-router';

export const landingRoutes: RouteObject[] = [
  {
    path: '/',
    lazy: async () => ({
      Component: (await import('./pages/landing-page')).default,
    }),
  },
];
