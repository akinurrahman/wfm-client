import { parseISO } from 'date-fns';

import { formatDate } from '@/lib/format';
import { formatDuration } from '@/lib/time';
import { cn } from '@/lib/utils';

import {
  MONTHLY_CELL_CODE,
  MONTHLY_CELL_TONE,
} from '../../definitions/attendance-monthly.constants';
import type { MonthlyDay } from '../../definitions/attendance-monthly.types';
import { attendanceStatusLookup } from '../../definitions/attendance.lookup';

type Props = {
  day: MonthlyDay;
  employeeName: string;
  onSelect: () => void;
};

function describe(day: MonthlyDay) {
  if (!day.eligible) return 'Not on rolls';
  if (!day.status) return 'Nothing has decided this day';

  const label = attendanceStatusLookup.resolve(day.status)?.label ?? day.status;
  const worked = day.workedMinutes ? `, ${formatDuration(day.workedMinutes)} worked` : '';
  const conflict = day.hasConflict ? ', conflict' : '';

  return `${label}${worked}${conflict}`;
}

/** Three states have to stay apart at a glance: outside the employee's on-rolls
 *  window, inside it but undecided, and decided. The middle one is the whole
 *  reason the month will not lock, so it is the one drawn as a hole. */
export function MonthlyDayCell({ day, employeeName, onSelect }: Props) {
  // parseISO, not the raw string: `new Date('2026-08-01')` is midnight UTC and
  // reads as the day before anywhere west of the line.
  const summary = `${formatDate(parseISO(day.date), 'dd MMM')}: ${describe(day)}`;

  if (!day.eligible) {
    return (
      <span
        title={summary}
        aria-label={summary}
        className="mx-auto flex size-9 items-center justify-center text-text-low sm:size-8"
      >
        <span aria-hidden className="h-px w-3 bg-hairline-strong" />
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      title={summary}
      aria-label={`${employeeName}, ${summary}`}
      className={cn(
        'mx-auto flex size-9 cursor-pointer items-center justify-center rounded-md border text-[12px] font-medium transition-colors duration-200 sm:size-8',
        day.status
          ? MONTHLY_CELL_TONE[day.status]
          : 'border-dashed border-hairline-strong text-text-low hover:bg-surface-3',
        day.hasConflict && 'ring-1 ring-overdue'
      )}
      data-numeric
    >
      {day.status ? MONTHLY_CELL_CODE[day.status] : ''}
    </button>
  );
}
