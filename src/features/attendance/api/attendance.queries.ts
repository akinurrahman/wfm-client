import { useQuery } from '@tanstack/react-query';

import { ATTENDANCE_KEYS, AUDIT_PAGE_SIZE } from '../definitions/attendance.constants';
import type { RosterFilters } from '../definitions/attendance.types';
import { attendanceApi } from './attendance.api';

export function useRoster(filters: RosterFilters) {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.roster(filters),
    queryFn: ({ signal }) => attendanceApi.getRoster(filters, signal),
    placeholderData: prev => prev,
  });
}

/** Paged inside a drawer rather than in the URL: the history is a detail of one
 *  row, not a view of the screen, so it must not survive a link being shared. */
export function useAttendanceAudit(attendanceId: string | null, page: number) {
  const filters = { page, limit: AUDIT_PAGE_SIZE };

  return useQuery({
    queryKey: ATTENDANCE_KEYS.audit(attendanceId ?? '', filters),
    queryFn: ({ signal }) => attendanceApi.getAudit(attendanceId as string, filters, signal),
    enabled: Boolean(attendanceId),
    placeholderData: prev => prev,
  });
}
