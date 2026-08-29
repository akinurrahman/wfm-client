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


export function useMyProfile() {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.me(),
    queryFn: ({ signal }) => employeeApi.getMe(signal),
  });
}

export function useEmployee(id: string) {
  return useQuery({
    queryKey: EMPLOYEE_KEYS.detail(id),
    queryFn: ({ signal }) => employeeApi.getById(id, signal),
    enabled: Boolean(id),
  });
}
