import { cn } from '@/lib/utils';

import {
  MONTHLY_CELL_CODE,
  MONTHLY_CELL_TONE,
} from '../../definitions/attendance-monthly.constants';
import { attendanceStatusLookup } from '../../definitions/attendance.lookup';
import type { AttendanceStatus } from '../../definitions/attendance.types';

/** One glyph per cell only works if the key is on the same screen as the grid. */
export function MonthlyLegend() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      {attendanceStatusLookup.values.map(value => (
        <Entry
          key={value}
          code={MONTHLY_CELL_CODE[value as AttendanceStatus]}
          tone={MONTHLY_CELL_TONE[value as AttendanceStatus]}
          label={attendanceStatusLookup.resolve(value)?.label ?? value}
        />
      ))}

      <Entry
        code=""
        tone="border-dashed border-hairline-strong"
        label="Nothing decided this day"
      />
      <Entry code="" tone="ring-1 ring-overdue border-hairline" label="Conflict" />
    </div>
  );
}

function Entry({ code, tone, label }: { code: string; tone: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        aria-hidden
        data-numeric
        className={cn(
          'flex size-5 items-center justify-center rounded border text-[10px] font-medium',
          tone
        )}
      >
        {code}
      </span>
      <span className="text-[11px] text-text-mid">{label}</span>
    </span>
  );
}
