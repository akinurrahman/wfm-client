import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse, Paginated } from '@/lib/api/types';

import type {
  AttendancePeriod,
  PeriodFilters,
  PeriodLockResult,
  PeriodPayload,
  PeriodSummaryFilters,
  PeriodSummaryRow,
  PeriodUnlockPayload,
} from '../definitions/attendance-period.types';

export const attendancePeriodApi = {
  list: (filters: PeriodFilters, signal?: AbortSignal) =>
    apiCall<Paginated<AttendancePeriod>>('/attendance-periods', {
      params: filters,
      signal,
    }),

  get: (id: string, signal?: AbortSignal) =>
    apiCall<ApiResponse<AttendancePeriod>>(`/attendance-periods/${id}`, {
      signal,
    }),

  /** There is no PATCH and no DELETE by design: moving a period's boundaries
   *  once rows exist silently re-scopes what is locked. */
  create: (payload: PeriodPayload) =>
    apiCall<ApiResponse<AttendancePeriod>>('/attendance-periods', {
      method: 'POST',
      body: payload,
    }),

  lock: (id: string) =>
    apiCall<ApiResponse<PeriodLockResult>>(`/attendance-periods/${id}/lock`, {
      method: 'POST',
    }),

  unlock: (id: string, payload: PeriodUnlockPayload) =>
    apiCall<ApiResponse<AttendancePeriod>>(`/attendance-periods/${id}/unlock`, {
      method: 'POST',
      body: payload,
    }),

  getSummary: (id: string, filters: PeriodSummaryFilters, signal?: AbortSignal) =>
    apiCall<Paginated<PeriodSummaryRow>>(`/attendance-periods/${id}/summary`, {
      params: filters,
      signal,
    }),
};
