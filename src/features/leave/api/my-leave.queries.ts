import { useQuery } from '@tanstack/react-query';

import { MY_LEAVE_KEYS } from '../definitions/my-leave.constants';
import type { MyLeaveFilters } from '../definitions/my-leave.types';
import { myLeaveApi } from './my-leave.api';

export function useMyLeaveList(filters: MyLeaveFilters) {
  return useQuery({
    queryKey: MY_LEAVE_KEYS.list(filters),
    queryFn: ({ signal }) => myLeaveApi.list(filters, signal),
    placeholderData: prev => prev,
  });
}
