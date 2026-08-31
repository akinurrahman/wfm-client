import { apiCall } from '@/lib/api/api-call';
import type { ApiAck, ApiResponse } from '@/lib/api/types';

import type {
  AuthUser,
  LoginPayload,
  LoginResult,
  LogoutPayload,
} from '../definitions/auth.types';


export const authApi = {
  login: (payload: LoginPayload) =>
    apiCall<ApiResponse<LoginResult>>('/auth/login', {
      method: 'POST',
      body: payload,
    }),

  logout: (payload: LogoutPayload) =>
    apiCall<ApiAck>('/auth/logout', {
      method: 'POST',
      body: payload,
    }),

  getMe: (signal?: AbortSignal) =>
    apiCall<ApiResponse<AuthUser>>('/auth/me', { signal}),
};
