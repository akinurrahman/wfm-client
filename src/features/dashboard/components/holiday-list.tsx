import { differenceInCalendarDays, parseISO } from 'date-fns';

import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';

import type { DashboardHolidaySummary } from '../definitions/dashboard.types';

type Props = {
  holidays: DashboardHolidaySummary[];
  /** The day the board describes, which is what "in 3 days" is counted from.
   *  Counting from the viewer's clock would misread on any other date. */
  from: string;
};

export function HolidayList({ holidays, from }: Props) {
  const anchor = parseISO(toCalendarDate(from));

  return (
    <ul className="divide-y divide-hairline">
      {holidays.map(holiday => {
        const away = differenceInCalendarDays(parseISO(toCalendarDate(holiday.date)), anchor);

        return (
          <li
            key={holiday.id}
            className="flex items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] font-medium text-text-hi">
                {holiday.names.join(', ')}
              </p>
              <p data-numeric className="mt-0.5 text-[12px] text-text-mid">
                {formatDate(toCalendarDate(holiday.date), 'EEE, dd MMM yyyy')}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              {holiday.isOptional ? (
                <Badge variant="outline" title="Optional: taken at the employee's choice.">
                  Optional
                </Badge>
              ) : null}
              <span data-numeric className="text-[12px] text-text-low">
                {away <= 0 ? 'today' : `in ${away}d`}
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
