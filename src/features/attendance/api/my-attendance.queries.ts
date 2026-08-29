import { useQuery } from '@tanstack/react-query';

import { MY_ATTENDANCE_KEYS } from '../definitions/my-attendance.constants';
import type { MyAttendanceFilters } from '../definitions/my-attendance.types';
import { myAttendanceApi } from './my-attendance.api';

export function useMyAttendanceMonth(filters: MyAttendanceFilters) {
  return useQuery({
    queryKey: MY_ATTENDANCE_KEYS.month(filters),
    queryFn: ({ signal }) => myAttendanceApi.getMonth(filters, signal),
    placeholderData: prev => prev,
  });
}
