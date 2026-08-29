import { parseISO } from 'date-fns';

import { formatDate } from '@/lib/format';
import { formatDuration } from '@/lib/time';
import { cn } from '@/lib/utils';

import {
  MONTHLY_CELL_CODE,
  MONTHLY_CELL_TONE,
} from '../../definitions/attendance-monthly.constants';
import { attendanceStatusLookup } from '../../definitions/attendance.lookup';
import type { MyAttendanceDay } from '../../definitions/my-attendance.types';

type Props = {
  day: MyAttendanceDay;
  isToday: boolean;
  isSelected: boolean;
  /** True on the first day of the grid and on every 1st after it. A cycle can
   *  run 26th to 25th, so which month a column belongs to is not obvious. */
  showMonth: boolean;
  onSelect: () => void;
};

/** What the day was, in the order a reader asks it: which leave paid for it,
 *  which festival it was, or how long was worked. */
function secondaryLine(day: MyAttendanceDay) {
  if (day.leave) return day.leave.code;
  if (day.holidayNames?.length) return day.holidayNames[0];
  if (day.workedMinutes) return formatDuration(day.workedMinutes);
  return null;
}

function describeDay(day: MyAttendanceDay) {
  if (!day.eligible) return 'Not on rolls';
  if (!day.status) return 'Not decided yet';

  const label = attendanceStatusLookup.resolve(day.status)?.label ?? day.status;
  const worked = day.workedMinutes ? `, ${formatDuration(day.workedMinutes)} worked` : '';
  const leave = day.leave ? `, ${day.leave.name}` : '';
  const conflict = day.hasConflict ? ', under review' : '';

  return `${label}${worked}${leave}${conflict}`;
}

/** A phone gives each column about 43px, so the cell is taller than it is wide
 *  and everything but the date and the glyph waits for `sm`. */
const CELL_BOX = 'h-14 rounded-lg border p-1 sm:h-20 sm:p-1.5';

/** Three states have to stay apart at a glance: outside the on-rolls window,
 *  inside it but not decided yet, and decided. The middle one is a blank day,
 *  never an absent one. */
export function MyAttendanceDayCell({ day, isToday, isSelected, showMonth, onSelect }: Props) {
  // parseISO, not the raw string: `new Date('2026-08-01')` is midnight UTC and
  // reads as the day before anywhere west of the line.
  const date = parseISO(day.date);
  const summary = `${formatDate(date, 'dd MMM')}: ${describeDay(day)}`;
  const secondary = secondaryLine(day);
  const code = day.status ? MONTHLY_CELL_CODE[day.status] : '';

  const dateLine = (
    <span className="flex items-center justify-between gap-0.5">
      <span
        data-numeric
        className={cn(
          'flex size-[18px] shrink-0 items-center justify-center rounded-full text-[11px] leading-none',
          isToday ? 'bg-brand font-semibold text-brand-contrast' : 'opacity-80'
        )}
      >
        {formatDate(date, 'd')}
      </span>

      {showMonth ? (
        <span className="truncate text-[9px] tracking-[0.1em] uppercase opacity-70">
          {formatDate(date, 'MMM')}
        </span>
      ) : day.holidayNames?.length ? (
        // The glyph says what the day counted as, not that it was a festival.
        <span aria-hidden className="size-1.5 shrink-0 rounded-full bg-current opacity-60" />
      ) : null}
    </span>
  );

  if (!day.eligible) {
    return (
      <div
        title={summary}
        aria-label={summary}
        className={cn(CELL_BOX, 'flex flex-col border-hairline bg-surface-2/40 text-text-low')}
      >
        {dateLine}
        <span aria-hidden className="m-auto h-px w-3 bg-hairline-strong" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      title={summary}
      aria-label={summary}
      aria-pressed={isSelected}
      className={cn(
        CELL_BOX,
        'flex cursor-pointer flex-col text-left transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none',
        day.status
          ? MONTHLY_CELL_TONE[day.status]
          : 'border-dashed border-hairline-strong text-text-low hover:bg-surface-3',
        day.hasConflict && 'ring-1 ring-overdue',
        isSelected && 'outline-2 outline-offset-1 outline-brand'
      )}
    >
      {dateLine}

      {/* On a phone the glyph is the cell: nothing else survives at 43px. */}
      <span data-numeric className="m-auto text-[13px] font-medium sm:hidden">
        {code}
      </span>

      <span className="mt-auto hidden items-end justify-between gap-1 sm:flex">
        <span data-numeric className="truncate text-[10px] opacity-80">
          {secondary}
        </span>
        <span data-numeric className="shrink-0 text-[12px] font-medium">
          {code}
        </span>
      </span>
    </button>
  );
}
