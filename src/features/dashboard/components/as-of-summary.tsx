import { differenceInCalendarDays, parseISO } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { periodStatusLookup } from '@/features/attendance';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import { LookupBadge } from '@/systems/ui/lookup-badge';

import type { DashboardAsOf, DashboardCycle, DashboardPeriod } from '../definitions/dashboard.types';

type Props = {
  asOf: DashboardAsOf;
  period: DashboardPeriod | null;
  cycle: DashboardCycle;
};

/** Rides in the filter row rather than in a panel of its own: the date picker
 *  beside it already says which day is on screen, so all this has to add is
 *  whether that day is today, whether the cycle is still open, and where in the
 *  cycle it falls. */
export function AsOfSummary({ asOf, period, cycle }: Props) {
  const start = parseISO(toCalendarDate(cycle.startDate));
  const end = parseISO(toCalendarDate(cycle.endDate));

  const cycleDays = differenceInCalendarDays(end, start) + 1;
  const dayOfCycle = Math.min(
    Math.max(differenceInCalendarDays(parseISO(toCalendarDate(asOf.date)), start) + 1, 0),
    cycleDays
  );

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
      {asOf.isToday ? (
        <Badge variant="settled">Today</Badge>
      ) : asOf.isFuture ? (
        <Badge
          variant="outline"
          title="Nothing has been decided this day yet, and nothing will be until it arrives."
        >
          Future day
        </Badge>
      ) : (
        <Badge
          variant="secondary"
          title={`Business today is ${formatDate(toCalendarDate(asOf.today), 'dd MMM yyyy')}.`}
        >
          Past day
        </Badge>
      )}

      {period ? (
        <LookupBadge lookup={periodStatusLookup} value={period.status} />
      ) : (
        <Badge
          variant="outline"
          className="border-dashed"
          title="No period covers this date, so it is open and the calendar month was used for the month-to-date window."
        >
          {cycle.isDeclaredPeriod ? 'Not declared' : 'Calendar month'}
        </Badge>
      )}

      <span data-numeric className="text-[12px] text-text-low">
        Day {dayOfCycle} of {cycleDays} · {formatDate(toCalendarDate(cycle.startDate), 'dd MMM')} to{' '}
        {formatDate(toCalendarDate(cycle.endDate), 'dd MMM yyyy')}
      </span>
    </div>
  );
}
