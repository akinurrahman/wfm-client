import { useQuery } from '@tanstack/react-query';

import { PERIOD_KEYS } from '../definitions/attendance-period.constants';
import type {
  PeriodFilters,
  PeriodSummaryFilters,
} from '../definitions/attendance-period.types';
import { attendancePeriodApi } from './attendance-period.api';

export function usePeriodList(filters: PeriodFilters) {
  return useQuery({
    queryKey: PERIOD_KEYS.list(filters),
    queryFn: ({ signal }) => attendancePeriodApi.list(filters, signal),
    placeholderData: prev => prev,
  });
}

export function usePeriod(id: string | undefined) {
  return useQuery({
    queryKey: PERIOD_KEYS.detail(id ?? ''),
    queryFn: ({ signal }) => attendancePeriodApi.get(id as string, signal),
    enabled: Boolean(id),
  });
}

export function usePeriodSummary(id: string | undefined, filters: PeriodSummaryFilters) {
  return useQuery({
    queryKey: PERIOD_KEYS.summary(id ?? '', filters),
    queryFn: ({ signal }) => attendancePeriodApi.getSummary(id as string, filters, signal),
    enabled: Boolean(id),
    placeholderData: prev => prev,
  });
}
