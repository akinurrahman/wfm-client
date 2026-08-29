import { type UserRole } from '@/constants/ROLES';

export const DEFAULT_ROUTES_BY_ROLE: Record<UserRole, string> = {
  SITE_ADMIN: '/dashboard',
  EMPLOYEE: '/profile',
};

export const AUTH_ROUTES = ['/login', '/forgot-password'];

/** Open to anyone signed in, whatever their role, and reached from the account
 *  menu rather than the nav. Route access is read off the sidebar, so a screen
 *  that is deliberately not in it has to be named here or it is unreachable. */
export const SELF_SERVICE_ROUTES = ['/profile'];
