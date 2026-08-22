import { useAuthStore } from '@/stores/auth.store';
import { USER_ROLES } from '@/constants/ROLES';
import type { UserRole } from '@/constants/ROLES';

declare global {
  interface Window {
    seedDummyAuth: typeof seedDummyAuth;
  }
}

export function seedDummyAuth(role: UserRole = USER_ROLES.keys.SITE_ADMIN) {
  const now = new Date().toISOString();

  useAuthStore.getState().login({
    accessToken: 'dev-access-token',
    refreshToken: 'dev-refresh-token',
    user: {
      _id: 'dev-user',
      fullName: 'Dev User',
      email: 'dev@example.com',
      role,
      isActive: true,
      lastLogin: now,
      createdAt: now,
      updatedAt: now,
    },
  });

  useAuthStore.setState({ isAuthInitialized: true });
}

window.seedDummyAuth = seedDummyAuth;
