import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse, Paginated } from '@/lib/api/types';

import type {
  PlannedAbsence,
  PlannedAbsenceCancelPayload,
  PlannedAbsenceCancelResult,
  PlannedAbsenceFilters,
  PlannedAbsencePayload,
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

  /** Withdrawn, never deleted: attendance rows point back at this record. */
  cancel: (id: string, payload: PlannedAbsenceCancelPayload) =>
    apiCall<ApiResponse<PlannedAbsenceCancelResult>>(`/planned-absences/${id}/cancel`, {
      method: 'PATCH',
      body: payload,
    }),
};
