import { getDate, getDay, parseISO } from 'date-fns';

import { Skeleton } from '@/components/ui/skeleton';
import { todayCalendarDate, toCalendarDate, WEEKDAYS } from '@/lib/time';
import { cn } from '@/lib/utils';

import type { MyAttendanceDay } from '../../definitions/my-attendance.types';
import { MyAttendanceDayCell } from './my-attendance-day-cell';

type Props = {
  days: MyAttendanceDay[];
  isLoading: boolean;
  /** The day whose sheet is open, so the grid keeps saying which one is being
   *  read behind it. */
  selectedDate: string | null;
  onSelectDay: (day: MyAttendanceDay) => void;
};

const WEEK_LENGTH = 7;
const WEEKEND_COLUMNS = new Set([0, 6]);

/** The cycle laid out as weeks rather than as a strip of 31. A cycle rarely
 *  starts on a Sunday, so the first row is padded to the weekday the window
 *  actually opens on and days keep sitting under the column they fell in. */
export function MyAttendanceCalendar({ days, isLoading, selectedDate, onSelectDay }: Props) {
  if (!days.length) return <CalendarSkeleton />;

  const today = todayCalendarDate();
  const leading = getDay(parseISO(days[0].date));
  const trailing = (WEEK_LENGTH - ((leading + days.length) % WEEK_LENGTH)) % WEEK_LENGTH;

  return (
    <section
      aria-label="Attendance calendar"
      className={cn(
        'm-panel m-panel-shine p-2 transition-opacity sm:p-4',
        isLoading && 'opacity-60'
      )}
    >
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {WEEKDAYS.map(weekday => (
          <div
            key={weekday.value}
            className={cn(
              'pb-1.5 text-center meta-label',
              WEEKEND_COLUMNS.has(Number(weekday.value)) ? 'text-text-low/70' : 'text-text-low'
            )}
          >
            {/* One letter is ambiguous across S/S and T/T, so the phone keeps
                two rather than dropping to an initial. */}
            <span className="sm:hidden">{weekday.label.slice(0, 2)}</span>
            <span className="hidden sm:inline">{weekday.label}</span>
          </div>
        ))}

        {Array.from({ length: leading }, (_, index) => (
          <div key={`lead-${index}`} aria-hidden />
        ))}

        {days.map((day, index) => (
          <MyAttendanceDayCell
            key={day.date}
            day={day}
            isToday={toCalendarDate(day.date) === today}
            isSelected={day.date === selectedDate}
            showMonth={index === 0 || getDate(parseISO(day.date)) === 1}
            onSelect={() => onSelectDay(day)}
          />
        ))}

        {Array.from({ length: trailing }, (_, index) => (
          <div key={`trail-${index}`} aria-hidden />
        ))}
      </div>
    </section>
  );
}

/** Six rows, the tallest a cycle can span, so the panel does not grow under the
 *  reader when the month lands. */
function CalendarSkeleton() {
  return (
    <div className="m-panel m-panel-shine p-2 sm:p-4">
      <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
        {Array.from({ length: 42 }, (_, index) => (
          <Skeleton key={index} className="h-14 rounded-lg sm:h-20" />
        ))}
      </div>
    </div>
  );
}
