import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ATTENDANCE_KEYS } from '@/features/attendance';

import { MY_LEAVE_KEYS } from '../definitions/my-leave.constants';
import type { MyLeaveApplyPayload } from '../definitions/my-leave.types';
import { PLANNED_ABSENCE_KEYS } from '../definitions/planned-absence.constants';
import type { PlannedAbsenceCancelPayload } from '../definitions/planned-absence.types';
import { myLeaveApi } from './my-leave.api';

/** One request, two lists: the admin queue reads the same rows through a
 *  different route, so a write on either side has to reach both. */
function invalidateBothLeaveLists(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: MY_LEAVE_KEYS.lists() });
  qc.invalidateQueries({ queryKey: PLANNED_ABSENCE_KEYS.lists() });
}

export function useApplyForLeave() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: MyLeaveApplyPayload) => myLeaveApi.apply(payload),
    onSuccess: () => {
      // A pending request is invisible to attendance, so no day moved and the
      // attendance branch stays as it was.
      invalidateBothLeaveLists(qc);
      toast.success('Leave requested', {
        description: 'It sits with your admin until they approve or turn it down.',
      });
    },
  });
}

export function useCancelMyLeave() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PlannedAbsenceCancelPayload }) =>
      myLeaveApi.cancel(id, payload),
    onSuccess: response => {
      invalidateBothLeaveLists(qc);
      // Withdrawing an approved request reverts days that were already closed,
      // which the roster and the monthly sheet are reading.
      qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all });

      const { reverted, conflicted } = response.data;
      toast.success('Request withdrawn', {
        description:
          reverted > 0
            ? `${reverted} ${reverted === 1 ? 'day' : 'days'} put back${conflicted > 0 ? `, ${conflicted} left for your admin to settle` : ''}`
            : 'Nothing had been approved yet, so no day changed.',
      });
    },
  });
}
