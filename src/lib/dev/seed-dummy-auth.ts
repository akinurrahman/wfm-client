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
  useAuthStore.setState({
    accessToken: 'dev-access-token',
    refreshToken: 'dev-refresh-token',
    isLoggedIn: true,
    isAuthInitialized: true,
    user: {
      id: 'dev-user',
      email: 'dev@example.com',
      role,
      employeeId: 'dev-employee',
      employeeCode: 'EMP001',
      fullName: 'Dev User',
      designation: 'Software Engineer',
    },
  });
}

window.seedDummyAuth = seedDummyAuth;
