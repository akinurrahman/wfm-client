import type { RouteObject } from 'react-router';

export const employeeRoutes: RouteObject[] = [
  {
    path: '/profile',
    lazy: async () => ({
      Component: (await import('./pages/me/my-profile-page')).default,
    }),
  },
  {
    path: '/employees',
    lazy: async () => ({
      Component: (await import('./pages/employees/employee-list-page')).default,
    }),
  },
  {
    path: '/employees/new',
    lazy: async () => ({
      Component: (await import('./pages/employees/employee-create-page')).default,
    }),
  },
  {
    path: '/employees/:id',
    lazy: async () => ({
      Component: (await import('./pages/employees/employee-view-page')).default,
    }),
  },
  {
    path: '/employees/:id/edit',
    lazy: async () => ({
      Component: (await import('./pages/employees/employee-edit-page')).default,
    }),
  },
];
