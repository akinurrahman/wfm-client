import { differenceInCalendarDays, parseISO } from 'date-fns';

import { plannedAbsenceStatusLookup, type PlannedAbsenceStatus } from '@/features/leave';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import type { DashboardAbsence, DashboardEmployeeRef } from '../definitions/dashboard.types';

/** Both boards send the same absence, one naming whose it is and the other
 *  saying where it has got to. Neither field is invented when it is absent. */
type AbsenceRow = DashboardAbsence & {
  employee?: DashboardEmployeeRef;
  status?: PlannedAbsenceStatus;
};

type Props = {
  absences: AbsenceRow[];
  /** Days the request has been sitting unanswered, which is the only thing that
   *  makes a pending queue urgent rather than long. */
  showWaiting?: boolean;
};

/** Both bounds are inclusive, so the 5th to the 7th is three days. */
const spanDays = (absence: AbsenceRow) =>
  differenceInCalendarDays(
    parseISO(toCalendarDate(absence.endDate)),
    parseISO(toCalendarDate(absence.startDate))
  ) + 1;

export function AbsenceList({ absences, showWaiting }: Props) {
  return (
    <ul className="divide-y divide-hairline">
      {absences.map(absence => {
        const days = spanDays(absence);
        const waiting = differenceInCalendarDays(new Date(), parseISO(absence.createdAt));

        return (
          <li
            key={absence.id}
            className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-text-hi">
                {absence.employee?.fullName ?? absence.leaveType.name}
              </p>

              <p data-numeric className="mt-0.5 truncate text-[12px] text-text-mid">
                {formatDate(toCalendarDate(absence.startDate), 'dd MMM')} to{' '}
                {formatDate(toCalendarDate(absence.endDate), 'dd MMM yyyy')}
                {absence.isHalfDay ? ' (half day)' : ` (${days} ${days === 1 ? 'day' : 'days'})`}
              </p>

              <p className="mt-0.5 truncate text-[12px] text-text-low" title={absence.reason}>
                {absence.employee ? `${absence.leaveType.name} · ` : ''}
                {absence.reason}
              </p>
            </div>

            <div className="shrink-0 text-right">
              {absence.status ? (
                <LookupBadge lookup={plannedAbsenceStatusLookup} value={absence.status} />
              ) : null}

              {showWaiting ? (
                <p data-numeric className="mt-1 text-[12px] text-text-low">
                  waiting {waiting} {waiting === 1 ? 'day' : 'days'}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
