import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse } from '@/lib/api/types';

import type { MyAttendanceFilters, MyAttendanceMonth } from '../definitions/my-attendance.types';

export const myAttendanceApi = {
  getMonth: (filters: MyAttendanceFilters, signal?: AbortSignal) =>
    apiCall<ApiResponse<MyAttendanceMonth>>('/attendance/me/monthly', {
      params: filters,
      signal,
    }),
};
