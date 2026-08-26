import { useQuery } from '@tanstack/react-query';

import { LEAVE_TYPE_KEYS } from '../definitions/leave-type.constants';
import { leaveTypeApi } from './leave-type.api';

/** Seeded configuration with no admin screen behind it, so it is read once and
 *  held for the session rather than refetched per dropdown. */
export function useLeaveTypeOptions() {
  return useQuery({
    queryKey: LEAVE_TYPE_KEYS.catalogue(),
    queryFn: ({ signal }) => leaveTypeApi.getCatalogue(signal),
    staleTime: 30 * 60_000,
    select: response =>
      response.data.data.map(leaveType => ({
        value: leaveType.id,
        label: `${leaveType.name} (${leaveType.code})`,
      })),
  });
}
