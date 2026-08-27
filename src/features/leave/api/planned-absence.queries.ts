import { useQuery } from '@tanstack/react-query';

import { PLANNED_ABSENCE_KEYS } from '../definitions/planned-absence.constants';
import type { PlannedAbsenceFilters } from '../definitions/planned-absence.types';
import { plannedAbsenceApi } from './planned-absence.api';

export function usePlannedAbsenceList(filters: PlannedAbsenceFilters) {
  return useQuery({
    queryKey: PLANNED_ABSENCE_KEYS.list(filters),
    queryFn: ({ signal }) => plannedAbsenceApi.list(filters, signal),
    placeholderData: prev => prev,
  });
}
