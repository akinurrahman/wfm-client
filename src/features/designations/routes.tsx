import type { RouteObject } from 'react-router';

export const designationRoutes: RouteObject[] = [
  {
    path: '/designations',
    lazy: async () => ({
      Component: (await import('./pages/designation-list-page')).default,
    }),
  },
];
