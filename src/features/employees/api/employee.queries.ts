import { useQuery } from '@tanstack/react-query';

import { EMPLOYEE_KEYS } from '../definitions/employee.constants';
import type { EmployeeFilters } from '../definitions/employee.types';
import { employeeApi } from './employee.api';

export function useEmployeeList(filters: EmployeeFilters) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.list(filters),
    queryFn: ({ signal }) => employeeApi.getList(filters, signal),
    placeholderData: prev => prev,
  });
}

/** One call backs the whole profile: the sub-resources have no GET routes of
 *  their own, so every tab reads this record. */
export function useEmployee(id: string) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.detail(id),
    queryFn: ({ signal }) => employeeApi.getById(id, signal),
    enabled: Boolean(id),
  });
}
