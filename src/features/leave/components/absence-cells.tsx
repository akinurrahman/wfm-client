import { differenceInCalendarDays, parseISO } from 'date-fns';

import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';

import type { PlannedAbsence } from '../definitions/planned-absence.types';

/** The three cells that read the same whoever is looking: an admin queue and an
 *  employee's own list show one request in the same words. */

export function LeaveTypeCell({ absence }: { absence: PlannedAbsence }) {
  if (!absence.leaveType) return <span className="text-text-low">-</span>;

  return (
    <div className="min-w-0">
      <span className="block truncate text-text-mid">{absence.leaveType.name}</span>
      <span data-numeric className="block text-[11px] text-text-low">
        {absence.leaveType.code}
        {absence.leaveType.isPaid ? ' - paid' : ' - unpaid'}
      </span>
    </div>
  );
}

/** Both bounds are inclusive, so the 5th to the 7th is three days. */
const spanDays = (absence: PlannedAbsence) =>
  differenceInCalendarDays(
    parseISO(toCalendarDate(absence.endDate)),
    parseISO(toCalendarDate(absence.startDate))
  ) + 1;

export function DatesCell({ absence }: { absence: PlannedAbsence }) {
  const days = spanDays(absence);

  return (
    <div className="min-w-0">
      <span data-numeric className="block text-text-mid">
        {formatDate(toCalendarDate(absence.startDate), 'dd MMM yyyy')} to{' '}
        {formatDate(toCalendarDate(absence.endDate), 'dd MMM yyyy')}
      </span>
      <span data-numeric className="block text-[11px] text-text-low">
        {absence.isHalfDay ? 'Half day' : `${days} ${days === 1 ? 'day' : 'days'}`}
      </span>
    </div>
  );
}

/** A closed request is only readable with the note that closed it, so the
 *  rejection or withdrawal reason rides under the original one. */
export function ReasonCell({ absence }: { absence: PlannedAbsence }) {
  const note = absence.rejectReason
    ? `Rejected: ${absence.rejectReason}`
    : absence.cancelReason
      ? `Withdrawn: ${absence.cancelReason}`
      : null;

  return (
    <div className="min-w-0 max-w-64">
      <span className="block truncate text-text-mid" title={absence.reason}>
        {absence.reason}
      </span>
      {note ? (
        <span className="block truncate text-[11px] text-text-low" title={note}>
          {note}
        </span>
      ) : null}
    </div>
  );
}
