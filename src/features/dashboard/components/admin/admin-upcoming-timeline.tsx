import { addDays, addYears, differenceInCalendarDays, isBefore, parseISO, setYear } from 'date-fns';

import { CalendarClock } from 'lucide-react';

import { EmptyState } from '@/components/shared/empty-state';
import { formatDate } from '@/lib/format';
import { toCalendarDate } from '@/lib/time';
import { cn } from '@/lib/utils';

import type { AdminCalendar, AdminLeave } from '../../definitions/admin-dashboard.types';
import { ChartLegend } from '../chart-legend';

type Props = {
  leave: AdminLeave;
  calendar: AdminCalendar;
  /** The day the window opens on, which is the board's date, not the viewer's. */
  from: string;
};

/** Birthdays are capped short of the API's own limit: past a handful the strip
 *  stops being a staffing view and turns into a list of names. */
const BIRTHDAY_ROWS = 6;

/** Roughly what a half-width panel fits before the day numbers collide. */
const MAX_TICKS = 8;

type Row = {
  key: string;
  label: string;
  detail: string;
  start: number;
  span: number;
  kind: 'leave' | 'holiday' | 'birthday';
};

/** Three sources on one axis. Absences are ranges, holidays and birthdays are
 *  points, and the question they all answer is the same one: what is coming and
 *  who will be missing when it does. */
export function AdminUpcomingTimeline({ leave, calendar, from }: Props) {
  const anchor = parseISO(toCalendarDate(from));
  const days = calendar.upcomingDays + 1;

  const dayIndex = (date: string) =>
    differenceInCalendarDays(parseISO(toCalendarDate(date)), anchor) + 1;
  const clamp = (index: number) => Math.min(Math.max(index, 1), days);

  // A date of birth carries the year it happened, so it lands decades behind
  // the window and clamps onto day one. Only the month and day are the event.
  const birthdayIndex = (dateOfBirth: string) => {
    const born = parseISO(toCalendarDate(dateOfBirth));
    const thisYear = setYear(born, anchor.getFullYear());
    const next = isBefore(thisYear, anchor) ? addYears(thisYear, 1) : thisYear;

    return differenceInCalendarDays(next, anchor) + 1;
  };

  const rows: Row[] = [
    ...leave.startingSoon.map(absence => {
      const start = clamp(dayIndex(absence.startDate));
      const end = clamp(dayIndex(absence.endDate));

      return {
        key: `leave-${absence.id}`,
        label: absence.employee.fullName,
        detail: `${absence.leaveType.name}, ${formatDate(toCalendarDate(absence.startDate), 'dd MMM')} to ${formatDate(toCalendarDate(absence.endDate), 'dd MMM')}`,
        start,
        span: Math.max(end - start + 1, 1),
        kind: 'leave' as const,
      };
    }),

    ...calendar.upcomingHolidays
      .filter(holiday => dayIndex(holiday.date) <= days)
      .map(holiday => ({
        key: `holiday-${holiday.id}`,
        label: holiday.names.join(', '),
        detail: `${holiday.isOptional ? 'Optional holiday' : 'Holiday'}, ${formatDate(toCalendarDate(holiday.date), 'EEE dd MMM')}`,
        start: clamp(dayIndex(holiday.date)),
        span: 1,
        kind: 'holiday' as const,
      })),

    ...calendar.birthdays
      .slice(0, BIRTHDAY_ROWS)
      .map(person => ({
        key: `birthday-${person.id}`,
        label: person.fullName,
        detail: `Birthday, ${formatDate(toCalendarDate(person.dateOfBirth), 'EEE dd MMM')}`,
        start: birthdayIndex(person.dateOfBirth),
        span: 1,
        kind: 'birthday' as const,
      }))
      .filter(row => row.start <= days),
  ].sort((a, b) => a.start - b.start || a.span - b.span);

  if (!rows.length) {
    return (
      <EmptyState
        icon={CalendarClock}
        title={`Nothing booked in the next ${calendar.upcomingDays} days`}
        description="Approved leave, holidays and birthdays inside the window all land on this strip. Widen the look-ahead to see further out."
        className="py-8"
      />
    );
  }

  const scale = Array.from({ length: days }, (_, index) => addDays(anchor, index));
  // A tick per day collides past a fortnight, so the labels thin out while the
  // grid behind them keeps one line per day.
  const tickEvery = Math.ceil(days / MAX_TICKS);

  const columns = { gridTemplateColumns: `repeat(${days}, minmax(0, 1fr))` };
  // One measurement drives the name column, the scale and the day lines, so the
  // three can never drift apart the way a hardcoded padding does.
  const track = { '--label-w': '8.5rem' } as React.CSSProperties;

  return (
    <div className="space-y-4" style={track}>
      <div>
        <div className="flex items-end gap-3 pb-1.5">
          <span className="w-[var(--label-w)] shrink-0" />
          <div className="grid flex-1" style={columns}>
            {scale.map((day, index) =>
              index % tickEvery ? (
                <span key={day.toISOString()} />
              ) : (
                <span key={day.toISOString()} className="text-center leading-tight">
                  <span className="block text-[10px] tracking-wide text-text-low uppercase">
                    {formatDate(day, 'EEEEE')}
                  </span>
                  <span data-numeric className="block text-[11px] text-text-mid">
                    {formatDate(day, 'd')}
                  </span>
                </span>
              )
            )}
          </div>
        </div>

        {/* The day lines start where the rows do. Run behind the scale as well
            and they read as a table the labels are trapped inside. */}
        <div className="relative border-t border-hairline">
          <div
            aria-hidden
            className="absolute inset-y-0 right-0 left-[calc(var(--label-w)+0.75rem)] grid"
            style={columns}
          >
            {scale.map((day, index) => (
              <span
                key={day.toISOString()}
                className={cn('border-l border-hairline/60', index === 0 && 'border-l-0')}
              />
            ))}
          </div>

          <ul className="relative divide-y divide-hairline/60">
            {rows.map(row => (
              <li key={row.key} className="flex items-center gap-3 py-2.5">
                <span className="w-[var(--label-w)] shrink-0">
                  <span className="block truncate text-[13px] text-text-hi" title={row.label}>
                    {row.label}
                  </span>
                  <span className="block truncate text-[11px] text-text-low" title={row.detail}>
                    {row.detail}
                  </span>
                </span>

                <div className="grid flex-1 items-center" style={columns}>
                  <span
                    title={`${row.label} · ${row.detail}`}
                    style={{ gridColumn: `${row.start} / span ${row.span}` }}
                    className={cn(
                      'rounded-full',
                      // A range gets a bar and a single day gets a disc, so the
                      // two never have to be told apart by width alone.
                      row.kind === 'leave' && 'h-1.5 bg-data',
                      row.kind === 'holiday' && 'mx-auto size-2.5 bg-brand-fill',
                      // Same hue as a holiday, different fill: a second calendar
                      // event does not need a second colour.
                      row.kind === 'birthday' &&
                        'mx-auto size-2.5 border border-brand-fill bg-brand-soft'
                    )}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <ChartLegend
          entries={[
            { key: 'leave', label: 'Approved leave', className: 'bg-data' },
            { key: 'holiday', label: 'Holiday', className: 'rounded-full bg-brand-fill' },
            {
              key: 'birthday',
              label: 'Birthday',
              className: 'rounded-full border border-brand-fill bg-brand-soft',
            },
          ]}
        />

        <span data-numeric className="text-[11px] text-text-low">
          {formatDate(anchor, 'd MMM')} to {formatDate(scale[days - 1], 'd MMM')}
        </span>
      </div>
    </div>
  );
}
