import type { RouteObject } from 'react-router';

export const leaveRoutes: RouteObject[] = [
  {
    path: '/leave',
    lazy: async () => ({
      Component: (await import('./pages/planned-absences/planned-absence-list-page')).default,
    }),
  },
];
