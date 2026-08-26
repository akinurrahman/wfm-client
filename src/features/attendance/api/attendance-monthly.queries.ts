import { useQuery } from '@tanstack/react-query';

import { MONTHLY_KEYS } from '../definitions/attendance-monthly.constants';
import type { MonthlyFilters } from '../definitions/attendance-monthly.types';
import { attendanceMonthlyApi } from './attendance-monthly.api';

export function useMonthlySheet(filters: MonthlyFilters) {
  return useQuery({
    queryKey: MONTHLY_KEYS.sheet(filters),
    queryFn: ({ signal }) => attendanceMonthlyApi.getSheet(filters, signal),
    placeholderData: prev => prev,
  });
}
