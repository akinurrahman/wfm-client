import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '@/stores/auth.store';

import { AUTH_KEYS } from '../definitions/auth.constants';
import { authApi } from './auth.api';

export function useAuthUser() {
  const accessToken = useAuthStore(s => s.accessToken);

  return useQuery({
    queryKey: AUTH_KEYS.me(),
    queryFn: ({ signal }) => authApi.getMe(signal),
    enabled: Boolean(accessToken),
    staleTime: 5 * 60_000,
    // A 401 here means the interceptor already tried a refresh and failed, so
    // the session is gone and retrying only delays the redirect.
    retry: false,
  });
}
