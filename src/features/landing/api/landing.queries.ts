import { useQuery } from '@tanstack/react-query';

import {
  HEALTH_RETRY_COUNT,
  HEALTH_STALE_TIME,
  LANDING_KEYS,
} from '../definitions/landing.constants';
import { landingApi } from './landing.api';

/** Fired on landing so the sleeping instance is already awake by the time
 *  someone reaches the sign-in form. */
export function useBackendHealth() {
  return useQuery({
    queryKey: LANDING_KEYS.health(),
    queryFn: ({ signal }) => landingApi.health(signal),
    staleTime: HEALTH_STALE_TIME,
    retry: HEALTH_RETRY_COUNT,
    retryDelay: attempt => Math.min(2000 * 2 ** attempt, 15000),
  });
}
