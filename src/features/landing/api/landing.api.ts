import { apiCall } from '@/lib/api/api-call';

import type { HealthStatus } from '../definitions/landing.types';

export const landingApi = {
  health: (signal?: AbortSignal) =>
    apiCall<HealthStatus>('/health', { signal, version: 'root' }),
};
