import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse, Paginated } from '@/lib/api/types';

import type { MyLeaveApplyPayload, MyLeaveFilters } from '../definitions/my-leave.types';
import type {
  PlannedAbsence,
  PlannedAbsenceCancelPayload,
  PlannedAbsenceCancelResult,
} from '../definitions/planned-absence.types';

export const myLeaveApi = {
  list: (filters: MyLeaveFilters, signal?: AbortSignal) =>
    apiCall<Paginated<PlannedAbsence>>('/planned-absences/me', { params: filters, signal }),

  /** Files the request as PENDING. Nothing is converted, so the response is the
   *  row alone rather than the counts an admin write carries. */
  apply: (payload: MyLeaveApplyPayload) =>
    apiCall<ApiResponse<PlannedAbsence>>('/planned-absences/me', {
      method: 'POST',
      body: payload,
    }),

  cancel: (id: string, payload: PlannedAbsenceCancelPayload) =>
    apiCall<ApiResponse<PlannedAbsenceCancelResult>>(`/planned-absences/me/${id}/cancel`, {
      method: 'PATCH',
      body: payload,
    }),
};
