import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse, Paginated } from '@/lib/api/types';

import type {
  PlannedAbsence,
  PlannedAbsenceCancelPayload,
  PlannedAbsenceCancelResult,
  PlannedAbsenceFilters,
  PlannedAbsencePayload,
  PlannedAbsenceRejectPayload,
  PlannedAbsenceResult,
} from '../definitions/planned-absence.types';

export const plannedAbsenceApi = {
  list: (filters: PlannedAbsenceFilters, signal?: AbortSignal) =>
    apiCall<Paginated<PlannedAbsence>>('/planned-absences', { params: filters, signal }),

  create: (payload: PlannedAbsencePayload) =>
    apiCall<ApiResponse<PlannedAbsenceResult>>('/planned-absences', {
      method: 'POST',
      body: payload,
    }),

  /** Takes no body: the approver comes off the token. This is where the past is
   *  rewritten, so the counts in the response are the whole point of the call. */
  approve: (id: string) =>
    apiCall<ApiResponse<PlannedAbsenceResult>>(`/planned-absences/${id}/approve`, {
      method: 'PATCH',
    }),

  reject: (id: string, payload: PlannedAbsenceRejectPayload) =>
    apiCall<ApiResponse<PlannedAbsence>>(`/planned-absences/${id}/reject`, {
      method: 'PATCH',
      body: payload,
    }),

  /** Withdrawn, never deleted: attendance rows point back at this record. */
  cancel: (id: string, payload: PlannedAbsenceCancelPayload) =>
    apiCall<ApiResponse<PlannedAbsenceCancelResult>>(`/planned-absences/${id}/cancel`, {
      method: 'PATCH',
      body: payload,
    }),
};
