import { createBrowserRouter } from 'react-router';

import LayoutWrapper from '@/components/layout';
import AuthGuard from '@/components/providers/auth-guard';
import AuthLayout from '@/components/providers/auth-layout';
import AccessDeniedPage from '@/components/shared/access-denied';
import NotFoundPage from '@/components/shared/not-found';
import { dashboardRoutes } from '@/features/dashboard';


export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    // children: [...authRoutes],
  },

  /* â”€â”€ Protected routes â”€â”€ */
  {
    element: (
      <AuthGuard>
        <LayoutWrapper />
      </AuthGuard>
    ),
    children: [...dashboardRoutes],
  },

  /* â”€â”€ Standalone â”€â”€ */
  { path: '/access-denied', element: <AccessDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
