import { type UserRole } from '@/constants/ROLES';

export const DEFAULT_ROUTES_BY_ROLE: Record<UserRole, string> = {
  SITE_ADMIN: '/dashboard',
  EMPLOYEE: '/dashboard',
};

export const AUTH_ROUTES = ['/login', '/forgot-password'];
