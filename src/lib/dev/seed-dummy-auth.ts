import { useAuthStore } from '@/stores/auth.store';
import { USER_ROLES } from '@/constants/ROLES';
import type { UserRole } from '@/constants/ROLES';

declare global {
  interface Window {
    seedDummyAuth: typeof seedDummyAuth;
  }
}

/** Fakes a signed-in session for UI work. The tokens are not real, so the first
 *  /auth/me against a live backend will 401 and clear this. */
export function seedDummyAuth(role: UserRole = USER_ROLES.keys.SITE_ADMIN) {
  const issuedAt = Math.floor(Date.now() / 1000);

  useAuthStore.setState({
    accessToken: 'dev-access-token',
    refreshToken: 'dev-refresh-token',
    isLoggedIn: true,
    isAuthInitialized: true,
    user: {
      sub: 'dev-user',
      email: 'dev@example.com',
      role,
      iat: issuedAt,
      exp: issuedAt + 3600,
    },
  });
}

window.seedDummyAuth = seedDummyAuth;
