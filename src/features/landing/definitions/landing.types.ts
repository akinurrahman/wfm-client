import type { UserRole } from '@/constants/ROLES';

export type DemoAccount = {
  role: UserRole;
  email: string;
  blurb: string;
};

export type HealthStatus = {
  status?: string;
};
