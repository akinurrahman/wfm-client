import type { UserRole } from "@/constants/ROLES";

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  message: string | string[];
  data: T;
};

/** A void service drops the `data` key entirely, so reading it would be a lie. */
export type ApiAck = Omit<ApiResponse<never>, "data">;

export type Paginated<T> = ApiResponse<T[]> & {
  pagination: Pagination;
};

/** An object (not a list) payload that still carries a pagination block, e.g. a
 *  ledger response whose `entries` are paged but whose totals are not. */
export type PaginatedObject<T> = ApiResponse<T> & {
  pagination: Pagination;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

/** The signed-in identity, returned by both `/auth/login` and `/auth/me`. The
 *  employee fields are null for an account with no employee record yet. Lives in
 *  lib because the refresh interceptor and the auth store both need it and
 *  neither may import a feature. */
export type AuthUser = {
  id: string;
  email: string;
  role: UserRole;
  employeeId: string | null;
  employeeCode: string | null;
  fullName: string | null;
  designation: string | null;
};
