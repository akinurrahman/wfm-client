import { defineUrlFilters, pagingSpec } from '@/systems/filters';

import type { MyLeaveFilters } from './my-leave.types';
import { plannedAbsenceStatusLookup } from './planned-absence.lookup';

/** Its own root, not a slice of the admin list: the same request appears in
 *  both, but one is scoped to a token and the other is not, so they cannot
 *  share a cache entry. */
export const MY_LEAVE_KEYS = {
  all: ['my-leave'] as const,
  lists: () => [...MY_LEAVE_KEYS.all, 'list'] as const,
  list: (filters: MyLeaveFilters) => [...MY_LEAVE_KEYS.lists(), filters] as const,
};

export const MY_LEAVE_FILTER_SPEC = defineUrlFilters<MyLeaveFilters>({
  from: {},
  to: {},
  status: { values: plannedAbsenceStatusLookup.values },
  ...pagingSpec(20),
});
