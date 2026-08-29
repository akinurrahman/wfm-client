import { type UserRole } from '@/constants/ROLES';
import {  SIDEBAR_ITEMS } from '@/constants/SIDEBAR_ITEMS';
import {  AUTH_ROUTES, SELF_SERVICE_ROUTES } from '@/constants/routes';

const matchesRoute = (pathname: string, route: string) =>
  pathname === route || pathname.startsWith(`${route}/`);

export function canAccessRoute(pathname: string, role: UserRole): boolean {
  if (AUTH_ROUTES.includes(pathname)) return true;
  if (SELF_SERVICE_ROUTES.some(route => matchesRoute(pathname, route))) return true;

  const allItems = SIDEBAR_ITEMS()
    .flatMap(group => group.items)
    .flatMap(item => (item.items ? [item, ...item.items] : [item]));

  const matched = allItems.find(item => matchesRoute(pathname, item.url));

  if (!matched) return false;
  if (!matched.roles || matched.roles.length === 0) return true;
  return matched.roles.includes(role);
}

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname);
}
