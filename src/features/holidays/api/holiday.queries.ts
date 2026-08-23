import { useQuery } from '@tanstack/react-query';

import { HOLIDAY_KEYS } from '../definitions/holiday.constants';
import type { HolidayFilters } from '../definitions/holiday.types';
import { holidayApi } from './holiday.api';

export function useHolidayList(filters: HolidayFilters) {
  return useQuery({
    queryKey: HOLIDAY_KEYS.list(filters),
    queryFn: ({ signal }) => holidayApi.getList(filters, signal),
    staleTime: 5 * 60_000,
    placeholderData: prev => prev,
  });
}
