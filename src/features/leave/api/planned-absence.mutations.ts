import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { ATTENDANCE_KEYS } from '@/features/attendance';

import { MY_LEAVE_KEYS } from '../definitions/my-leave.constants';
import { PLANNED_ABSENCE_KEYS } from '../definitions/planned-absence.constants';
import type {
  PlannedAbsenceCancelPayload,
  PlannedAbsencePayload,
  PlannedAbsenceRejectPayload,
} from '../definitions/planned-absence.types';
import { plannedAbsenceApi } from './planned-absence.api';

/** The decision lands on a row the employee is also looking at, through the
 *  `me` route and its own cache. */
function invalidateBothLeaveLists(qc: ReturnType<typeof useQueryClient>) {
  qc.invalidateQueries({ queryKey: PLANNED_ABSENCE_KEYS.lists() });
  qc.invalidateQueries({ queryKey: MY_LEAVE_KEYS.lists() });
}

/** Writes that retro-convert days take the whole attendance branch with them:
 *  the roster, the monthly sheet and the day summaries all read rows this just
 *  rewrote. */
function invalidateLeaveAndAttendance(qc: ReturnType<typeof useQueryClient>) {
  invalidateBothLeaveLists(qc);
  qc.invalidateQueries({ queryKey: ATTENDANCE_KEYS.all });
}

/** The counts exist only in this one response and nothing on screen holds them,
 *  so they ride the toast. Conflicts are called out because they are the half
 *  that still needs a person: the API left those days contradicting the leave
 *  rather than guessing. */
function outcomeText(moved: number, movedVerb: string, conflicted: number) {
  const parts = [`${moved} ${moved === 1 ? 'day' : 'days'} ${movedVerb}`];
  if (conflicted > 0) parts.push(`${conflicted} left to settle by hand`);
  return parts.join(', ');
}

export function useCreatePlannedAbsence() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: PlannedAbsencePayload) => plannedAbsenceApi.create(payload),
    onSuccess: response => {
      invalidateLeaveAndAttendance(qc);
      const { converted, conflicted } = response.data;
      toast.success('Leave recorded', {
        description: outcomeText(converted, 'converted', conflicted),
      });
    },
  });
}

export function useApprovePlannedAbsence() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => plannedAbsenceApi.approve(id),
    onSuccess: response => {
      invalidateLeaveAndAttendance(qc);
      const { converted, conflicted } = response.data;
      toast.success('Leave approved', {
        description: outcomeText(converted, 'converted', conflicted),
      });
    },
  });
}

export function useRejectPlannedAbsence() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PlannedAbsenceRejectPayload }) =>
      plannedAbsenceApi.reject(id, payload),
    onSuccess: () => {
      // A pending request had converted nothing, so attendance is untouched.
      invalidateBothLeaveLists(qc);
      toast.success('Leave rejected', {
        description: 'The reason is on the request, so the employee can read it.',
      });
    },
  });
}

export function useCancelPlannedAbsence() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: PlannedAbsenceCancelPayload }) =>
      plannedAbsenceApi.cancel(id, payload),
    onSuccess: response => {
      invalidateLeaveAndAttendance(qc);
      const { reverted, conflicted } = response.data;
      toast.success('Leave withdrawn', {
        description: outcomeText(reverted, 'reverted', conflicted),
      });
    },
  });
}
