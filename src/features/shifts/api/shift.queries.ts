import { useQuery } from '@tanstack/react-query';

import { SHIFT_KEYS, SHIFT_OPTIONS_LIMIT } from '../definitions/shift.constants';
import type { ShiftFilters } from '../definitions/shift.types';
import { shiftApi } from './shift.api';

export function useShiftList(filters: ShiftFilters) {
  return useQuery({
    queryKey: SHIFT_KEYS.list(filters),
    queryFn: ({ signal }) => shiftApi.getList(filters, signal),
    placeholderData: prev => prev,
  });
}

export function useShiftOptions() {
  return useQuery({
    queryKey: SHIFT_KEYS.options(),
    queryFn: ({ signal }) =>
      shiftApi.getList({ isActive: 'true', page: 1, limit: SHIFT_OPTIONS_LIMIT }, signal),
    staleTime: 5 * 60_000,
    select: response =>
      response.data.map(shift => ({ value: shift.id, label: `${shift.name} (${shift.code})` })),
  });
}
