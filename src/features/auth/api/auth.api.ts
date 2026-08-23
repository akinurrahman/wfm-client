import { apiCall } from '@/lib/api/api-call';
import type { ApiAck, ApiResponse } from '@/lib/api/types';

import type {
  AuthUser,
  LoginPayload,
  LogoutPayload,
  Tokens,
} from '../definitions/auth.types';

// The auth service has no global prefix, so every call rides the root instance.
// POST /auth/refresh is deliberately absent: it lives in the response
// interceptor, which is the only place that can queue concurrent callers behind
// one rotation.
export const authApi = {
  login: (payload: LoginPayload) =>
    apiCall<ApiResponse<Tokens>>('/auth/login', {
      method: 'POST',
      body: payload,
      version: 'root',
    }),

  logout: (payload: LogoutPayload) =>
    apiCall<ApiAck>('/auth/logout', {
      method: 'POST',
      body: payload,
      version: 'root',
    }),

  getMe: (signal?: AbortSignal) =>
    apiCall<ApiResponse<AuthUser>>('/auth/me', { signal, version: 'root' }),
};
