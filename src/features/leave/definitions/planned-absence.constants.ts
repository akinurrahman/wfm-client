import { defineUrlFilters, pagingSpec } from '@/systems/filters';

import { plannedAbsenceStatusLookup } from './planned-absence.lookup';
import type { PlannedAbsenceFilters } from './planned-absence.types';

export const PLANNED_ABSENCE_KEYS = {
  all: ['planned-absences'] as const,
  lists: () => [...PLANNED_ABSENCE_KEYS.all, 'list'] as const,
  list: (filters: PlannedAbsenceFilters) => [...PLANNED_ABSENCE_KEYS.lists(), filters] as const,
};

export const PLANNED_ABSENCE_FILTER_SPEC = defineUrlFilters<PlannedAbsenceFilters>({
  employeeId: {},
  from: {},
  to: {},
  status: { values: plannedAbsenceStatusLookup.values },
  ...pagingSpec(20),
});

export const REASON_MAX = 500;
