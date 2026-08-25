import { defineUrlFilters, pagingSpec } from '@/systems/filters';

import type { ShiftFilters } from './shift.types';

export const SHIFT_KEYS = {
  all: ['shifts'] as const,
  lists: () => [...SHIFT_KEYS.all, 'list'] as const,
  list: (filters: ShiftFilters) => [...SHIFT_KEYS.lists(), filters] as const,
  options: () => [...SHIFT_KEYS.all, 'options'] as const,
};

export const SHIFT_OPTIONS_LIMIT = 100;

/** The API reads `isActive` as the strings "true"/"false", so the filter holds
 *  them verbatim rather than a boolean it would have to stringify twice. */
export const ACTIVE_OPTIONS = [
  { value: 'true', label: 'Active' },
  { value: 'false', label: 'Inactive' },
] as const;

export const SHIFT_FILTER_SPEC = defineUrlFilters<ShiftFilters>({
  search: {},
  isActive: { values: ACTIVE_OPTIONS.map(option => option.value) },
  ...pagingSpec(10, 100),
});

export const SHIFT_NAME_MAX = 100;
export const SHIFT_CODE_MAX = 20;
