import type { UserRole } from '@/constants/ROLES';
import type { AuthUser, Tokens } from '@/lib/api/types';

export type { AuthUser, Tokens, UserRole };

export type LoginPayload = {
  email: string;
  password: string;
};

export type LogoutPayload = {
  refreshToken: string;
};
