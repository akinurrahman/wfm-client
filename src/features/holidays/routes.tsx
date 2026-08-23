import type { RouteObject } from 'react-router';

export const holidayRoutes: RouteObject[] = [
  {
    path: '/holidays',
    lazy: async () => ({
      Component: (await import('./pages/holiday-list-page')).default,
    }),
  },
];
