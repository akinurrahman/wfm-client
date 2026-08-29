import type { RouteObject } from 'react-router';

export const leaveRoutes: RouteObject[] = [
  {
    path: '/my-leave',
    lazy: async () => ({
      Component: (await import('./pages/my-leave/my-leave-list-page')).default,
    }),
  },
  {
    path: '/leave',
    lazy: async () => ({
      Component: (await import('./pages/planned-absences/planned-absence-list-page')).default,
    }),
  },
];
