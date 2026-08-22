import { type UserRole } from '@/constants/ROLES';
import {  SIDEBAR_ITEMS } from '@/constants/SIDEBAR_ITEMS';
import {  AUTH_ROUTES } from '@/constants/routes';

export function canAccessRoute(pathname: string, role: UserRole): boolean {
  if (AUTH_ROUTES.includes(pathname)) return true;

  const allItems = SIDEBAR_ITEMS()
    .flatMap(group => group.items)
    .flatMap(item => (item.items ? [item, ...item.items] : [item]));

  const matched = allItems.find(
    item => pathname === item.url || pathname.startsWith(`${item.url}/`)
  );

  if (!matched) return false;
  if (!matched.roles || matched.roles.length === 0) return true;
  return matched.roles.includes(role);
}

export function isAuthRoute(pathname: string) {
  return AUTH_ROUTES.includes(pathname);
}
