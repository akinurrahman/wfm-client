import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { Paginated } from '@/lib/api/types';

import { ATTENDANCE_KEYS } from '../definitions/attendance.constants';
import type {
  Attendance,
  AttendanceBulkPayload,
  AttendanceMarkInput,
  RosterFilters,
  RosterRow,
} from '../definitions/attendance.types';
import { attendanceApi } from './attendance.api';

/** The save returns the rows it wrote, so the table is patched from the
 *  server's own answer rather than refetched. The derived display fields are
 *  restated from the stored row: a saved day is by definition marked, and its
 *  status, source and conflict flag now come from the row itself. */
function patchRosterRows(previous: Paginated<RosterRow> | undefined, saved: Attendance[]) {
  if (!previous) return previous;

  const byEmployee = new Map(saved.map(row => [row.employeeId, row]));

  return {
    ...previous,
    data: previous.data.map(row => {
      const next = byEmployee.get(row.employee.id);
      if (!next) return row;

      return {
        ...row,
        attendance: next,
        dayType: next.dayType,
        status: next.status,
        isMarked: true,
        source: next.source,
        hasConflict: next.hasConflict,
      };
    }),
  };
}

/** Takes the roster's current filters so the write lands in the cache entry the
 *  table is actually reading, which is what makes the in-place patch possible. */
export function useSaveAttendanceBulk(filters: RosterFilters) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: AttendanceBulkPayload) => attendanceApi.saveBulk(payload),
    onSuccess: response => {
      const { created, updated, attendance } = response.data;

      qc.setQueryData<Paginated<RosterRow>>(ATTENDANCE_KEYS.roster(filters), previous =>
        patchRosterRows(previous, attendance)
      );

      const total = created + updated;
      toast.success(`${total} ${total === 1 ? 'day' : 'days'} saved`);
    },
  });
}

export function useUpdateAttendance(filters: RosterFilters) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AttendanceMarkInput }) =>
      attendanceApi.update(id, payload),
    onSuccess: response => {
      qc.setQueryData<Paginated<RosterRow>>(ATTENDANCE_KEYS.roster(filters), previous =>
        patchRosterRows(previous, [response.data])
      );

      // The history drawer for this row is now a version behind.
      qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.audits() });
      toast.success('Attendance updated');
    },
  });
}
