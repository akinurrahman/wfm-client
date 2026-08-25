import { useQuery } from '@tanstack/react-query';

import { DESIGNATION_KEYS } from '../definitions/designation.constants';
import type { DesignationListParams } from '../definitions/designation.types';
import { designationApi } from './designation.api';

export function useDesignationList(params: DesignationListParams = {}) {
  return useQuery({
    queryKey: DESIGNATION_KEYS.list(params),
    queryFn: ({ signal }) => designationApi.getList(params, signal),
    staleTime: 5 * 60_000,
    placeholderData: prev => prev,
  });
}

export function useDesignationOptions() {
  return useQuery({
    queryKey: DESIGNATION_KEYS.list({}),
    queryFn: ({ signal }) => designationApi.getList({}, signal),
    staleTime: 5 * 60_000,
    select: response =>
      response.data.map(designation => ({ value: designation.id, label: designation.title })),
  });
}
