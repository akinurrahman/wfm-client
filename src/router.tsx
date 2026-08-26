import { createBrowserRouter } from 'react-router';

import LayoutWrapper from '@/components/layout';
import AuthGuard from '@/components/providers/auth-guard';
import AuthLayout from '@/components/providers/auth-layout';
import AccessDeniedPage from '@/components/shared/access-denied';
import NotFoundPage from '@/components/shared/not-found';
import { attendanceRoutes } from '@/features/attendance';
import { authRoutes } from '@/features/auth';
import { dashboardRoutes } from '@/features/dashboard';
import { designationRoutes } from '@/features/designations';
import { employeeRoutes } from '@/features/employees';
import { holidayRoutes } from '@/features/holidays';
import { shiftRoutes } from '@/features/shifts';


export const router = createBrowserRouter([
  {
    element: <AuthLayout />,
    children: [...authRoutes],
  },

  {
    element: (
      <AuthGuard>
        <LayoutWrapper />
      </AuthGuard>
    ),
    children: [
      ...dashboardRoutes,
      ...designationRoutes,
      ...shiftRoutes,
      ...holidayRoutes,
      ...employeeRoutes,
      ...attendanceRoutes,
    ],
  },

  /* â”€â”€ Standalone â”€â”€ */
  { path: '/access-denied', element: <AccessDeniedPage /> },
  { path: '*', element: <NotFoundPage /> },
]);
