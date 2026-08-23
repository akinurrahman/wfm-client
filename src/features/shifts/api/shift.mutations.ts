import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { SHIFT_KEYS } from '../definitions/shift.constants';
import type { ShiftPayload } from '../definitions/shift.types';
import { shiftApi } from './shift.api';

export function useCreateShift() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ShiftPayload) => shiftApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHIFT_KEYS.lists() });
      toast.success('Shift created');
    },
  });
}

export function useUpdateShift(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: ShiftPayload) => shiftApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHIFT_KEYS.lists() });
      toast.success('Shift updated');
    },
  });
}

export function useDeleteShift() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => shiftApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: SHIFT_KEYS.lists() });
      toast.success('Shift deleted');
    },
  });
}
