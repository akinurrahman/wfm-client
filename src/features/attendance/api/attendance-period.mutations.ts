import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { MONTHLY_KEYS } from '../definitions/attendance-monthly.constants';
import { PERIOD_KEYS } from '../definitions/attendance-period.constants';
import type {
  PeriodPayload,
  PeriodUnlockPayload,
} from '../definitions/attendance-period.types';
import { attendancePeriodApi } from './attendance-period.api';

export function useCreatePeriod() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: PeriodPayload) => attendancePeriodApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: PERIOD_KEYS.lists() });
      // A declared cycle re-scopes which days the sheet reads for that label.
      qc.invalidateQueries({ queryKey: MONTHLY_KEYS.sheets() });
      toast.success('Period declared');
    },
  });
}

export function useLockPeriod() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attendancePeriodApi.lock(id),
    onSuccess: (_response, id) => {
      qc.invalidateQueries({ queryKey: PERIOD_KEYS.lists() });
      qc.invalidateQueries({ queryKey: PERIOD_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: PERIOD_KEYS.summaries() });
      // The sheet's cycle now reads LOCKED, and the days behind it are frozen.
      qc.invalidateQueries({ queryKey: MONTHLY_KEYS.sheets() });
      toast.success('Month locked');
    },
  });
}

export function useUnlockPeriod() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PeriodUnlockPayload }) =>
      attendancePeriodApi.unlock(id, payload),
    onSuccess: (_response, { id }) => {
      qc.invalidateQueries({ queryKey: PERIOD_KEYS.lists() });
      qc.invalidateQueries({ queryKey: PERIOD_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: MONTHLY_KEYS.sheets() });
      toast.success('Period unlocked');
    },
  });
}
