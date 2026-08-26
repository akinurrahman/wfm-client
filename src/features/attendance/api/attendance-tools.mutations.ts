import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ATTENDANCE_KEYS } from '../definitions/attendance.constants';
import type { DerivePayload } from '../definitions/attendance-tools.types';
import { attendanceToolsApi } from './attendance-tools.api';

/** Both repair passes rewrite whole ranges of days, so every roster page in the
 *  cache is suspect afterwards and the whole branch is invalidated. */
export function useDeriveAttendance() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: DerivePayload) => attendanceToolsApi.derive(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all });
      toast.success('Attendance derived');
    },
  });
}

export function useCloseAttendanceDay() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (date: string) => attendanceToolsApi.close(date),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all });
      toast.success('Day closed');
    },
  });
}
