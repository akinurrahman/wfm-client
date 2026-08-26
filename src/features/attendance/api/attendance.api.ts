import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse, Paginated } from '@/lib/api/types';

import type {
  Attendance,
  AttendanceAuditEntry,
  AttendanceAuditFilters,
  AttendanceBulkPayload,
  AttendanceBulkResult,
  AttendanceMarkInput,
  RosterFilters,
  RosterRow,
} from '../definitions/attendance.types';

export const attendanceApi = {
  getRoster: (filters: RosterFilters, signal?: AbortSignal) =>
    apiCall<Paginated<RosterRow>>('/attendance/roster', {
      params: filters,
      signal,
      version: 'root',
    }),

  getAudit: (id: string, filters: AttendanceAuditFilters, signal?: AbortSignal) =>
    apiCall<Paginated<AttendanceAuditEntry>>(`/attendance/${id}/audit`, {
      params: filters,
      signal,
      version: 'root',
    }),

  /** Corrects one already-decided day. The id is itself the proof a row exists,
   *  which is why a day with no row has to go through the bulk route instead. */
  update: (id: string, payload: AttendanceMarkInput) =>
    apiCall<ApiResponse<Attendance>>(`/attendance/${id}`, {
      method: 'PATCH',
      body: payload,
      version: 'root',
    }),

  saveBulk: (payload: AttendanceBulkPayload) =>
    apiCall<ApiResponse<AttendanceBulkResult>>('/attendance/bulk', {
      method: 'POST',
      body: payload,
      version: 'root',
    }),
};
