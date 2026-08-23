import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { DESIGNATION_KEYS } from '../definitions/designation.constants';
import type { DesignationFormValues } from '../definitions/designation.schema';
import { designationApi } from './designation.api';

export function useCreateDesignation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: DesignationFormValues) => designationApi.create(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DESIGNATION_KEYS.lists() });
      toast.success('Designation created');
    },
  });
}

export function useUpdateDesignation(id: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (values: DesignationFormValues) => designationApi.update(id, values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DESIGNATION_KEYS.lists() });
      toast.success('Designation updated');
    },
  });
}

export function useDeleteDesignation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => designationApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: DESIGNATION_KEYS.lists() });
      toast.success('Designation deleted');
    },
  });
}
