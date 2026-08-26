import { apiCall } from '@/lib/api/api-call';

import type { MonthlyFilters, MonthlySheet } from '../definitions/attendance-monthly.types';

export const attendanceMonthlyApi = {
  /** `year` and `month` are the cycle's label, not a calendar filter: a
   *  26th-to-25th cycle labelled August starts in July and this returns it. */
  getSheet: (filters: MonthlyFilters, signal?: AbortSignal) =>
    apiCall<MonthlySheet>('/attendance/monthly', {
      params: filters,
      signal,
    }),
};
