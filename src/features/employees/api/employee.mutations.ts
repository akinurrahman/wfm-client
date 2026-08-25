import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { EMPLOYEE_KEYS } from '../definitions/employee.constants';
import type {
  EmployeeCreatePayload,
  EmployeeUpdatePayload,
} from '../definitions/employee.types';
import { employeeApi } from './employee.api';

export function useCreateEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeeCreatePayload) => employeeApi.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      toast.success('Employee created');
    },
  });
}

export function useUpdateEmployee(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: EmployeeUpdatePayload) => employeeApi.update(id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      toast.success('Employee updated');
    },
  });
}

export function useDeleteEmployee() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeApi.remove(id),
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: EMPLOYEE_KEYS.detail(id) });
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.lists() });
      toast.success('Employee deleted');
    },
  });
}
