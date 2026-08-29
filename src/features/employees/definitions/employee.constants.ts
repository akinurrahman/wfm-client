import { defineUrlFilters, pagingSpec } from '@/systems/filters';

import { employeeTypeLookup, genderLookup } from './employee.lookup';
import type { EmployeeFilters } from './employee.types';

export const EMPLOYEE_KEYS = {
  all: ['employees'] as const,
  lists: () => [...EMPLOYEE_KEYS.all, 'list'] as const,
  list: (filters: EmployeeFilters) => [...EMPLOYEE_KEYS.lists(), filters] as const,
  details: () => [...EMPLOYEE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...EMPLOYEE_KEYS.details(), id] as const,
  me: () => [...EMPLOYEE_KEYS.all, 'me'] as const,
};

/** The API reads `isActive` as the strings "true"/"false", so the filter holds
 *  them verbatim rather than a boolean it would have to stringify twice. */
export const EMPLOYEE_STATUS_OPTIONS = [
  { value: 'true', label: 'On rolls' },
  { value: 'false', label: 'Exited' },
] as const;

export const EMPLOYEE_FILTER_SPEC = defineUrlFilters<EmployeeFilters>({
  search: {},
  designationId: {},
  employeeType: { values: employeeTypeLookup.values },
  gender: { values: genderLookup.values },
  isActive: { values: EMPLOYEE_STATUS_OPTIONS.map(option => option.value) },
  ...pagingSpec(10, 100),
});

export const FULL_NAME_MAX = 150;
export const ADDRESS_LINE_MAX = 255;
