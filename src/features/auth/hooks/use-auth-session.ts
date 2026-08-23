import { useEffect } from 'react';

import { useAuthStore } from '@/stores/auth.store';

import { useAuthUser } from '../api/auth.queries';

/** Keeps the persisted store in step with /auth/me. Mounted by both the auth
 *  layout and the guard, which share one query key and so one request. */
export function useAuthSession() {
  const { data, isError } = useAuthUser();

  useEffect(() => {
    if (data) useAuthStore.getState().setUser(data.data);
  }, [data]);

  useEffect(() => {
    // /auth/me is the last word on a session. Holding tokens it rejected would
    // park the layout on its loading state with nothing left to wait for.
    if (isError) useAuthStore.getState().logout();
  }, [isError]);
}
