import type { RouteObject } from 'react-router';

export const shiftRoutes: RouteObject[] = [
  {
    path: '/shifts',
    lazy: async () => ({
      Component: (await import('./pages/shift-list-page')).default,
    }),
  },
];
