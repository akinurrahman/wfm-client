import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { useAuthStore } from '@/stores/auth.store';

import { AUTH_KEYS } from '../definitions/auth.constants';
import type { LoginFormValues } from '../definitions/auth.schema';
import { authApi } from './auth.api';

export function useLogin() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    // A rejected credential belongs on the form the person is looking at, not
    // in a toast that floats away while they retype.
    onError: () => {},
    onSuccess: res => {
      const { user, ...tokens } = res.data;
      useAuthStore.getState().setSession(tokens, user);
      // Login already carries the /auth/me payload, so seeding the cache spares
      // a duplicate request the moment the query switches on.
      qc.setQueryData(AUTH_KEYS.me(), { ...res, data: user });
      toast.success('Signed in');
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const { refreshToken } = useAuthStore.getState();
      return authApi.logout({ refreshToken: refreshToken ?? '' });
    },
    // Best effort. A revoked or expired refresh token still means the session
    // is over, so the client tears down either way and the server error is not
    // worth a toast.
    onError: () => {},
    onSuccess: () => toast.success('Signed out'),
    onSettled: () => {
      useAuthStore.getState().logout();
      qc.clear();
    },
  });
}
