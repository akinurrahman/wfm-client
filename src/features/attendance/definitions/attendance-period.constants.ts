import { defineUrlFilters, pagingSpec } from '@/systems/filters';

import { periodStatusLookup } from './attendance-period.lookup';
import type { PeriodFilters, PeriodSummaryFilters } from './attendance-period.types';

export const PERIOD_KEYS = {
  all: ['attendance-periods'] as const,
  lists: () => [...PERIOD_KEYS.all, 'list'] as const,
  list: (filters: PeriodFilters) => [...PERIOD_KEYS.lists(), filters] as const,
  details: () => [...PERIOD_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...PERIOD_KEYS.details(), id] as const,
  summaries: () => [...PERIOD_KEYS.all, 'summary'] as const,
  summary: (id: string, filters: PeriodSummaryFilters) =>
    [...PERIOD_KEYS.summaries(), id, filters] as const,
};

export const PERIOD_FILTER_SPEC = defineUrlFilters<PeriodFilters>({
  year: { kind: 'number', min: 2000, max: 2999 },
  status: { values: periodStatusLookup.values },
  ...pagingSpec(20),
});

export const PERIOD_SUMMARY_FILTER_SPEC = defineUrlFilters<PeriodSummaryFilters>({
  version: { kind: 'number', min: 1 },
  ...pagingSpec(25, 100),
});

/** "Fix" is rejected on purpose: an unlock has to say what arrived late. */
export const UNLOCK_REASON_MIN = 10;
export const UNLOCK_REASON_MAX = 500;
