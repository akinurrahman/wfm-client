import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { HOLIDAY_KEYS } from '../definitions/holiday.constants';
import type { HolidayPayload } from '../definitions/holiday.types';
import { holidayApi } from './holiday.api';

export function useCreateHoliday() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: HolidayPayload) => holidayApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HOLIDAY_KEYS.lists() });
      toast.success('Holiday added');
    },
  });
}

export function useUpdateHoliday(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: HolidayPayload) => holidayApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HOLIDAY_KEYS.lists() });
      toast.success('Holiday updated');
    },
  });
}

export function useDeleteHoliday() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => holidayApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: HOLIDAY_KEYS.lists() });
      toast.success('Holiday deleted');
    },
  });
}
