import { useQuery } from '@tanstack/react-query';

import { SHIFT_KEYS } from '../definitions/shift.constants';
import type { ShiftFilters } from '../definitions/shift.types';
import { shiftApi } from './shift.api';

export function useShiftList(filters: ShiftFilters) {
  return useQuery({
    queryKey: SHIFT_KEYS.list(filters),
    queryFn: ({ signal }) => shiftApi.getList(filters, signal),
    placeholderData: prev => prev,
  });
}
