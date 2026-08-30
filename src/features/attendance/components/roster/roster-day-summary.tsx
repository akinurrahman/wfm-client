import { cn } from '@/lib/utils';

import type { RosterRow } from '../../definitions/attendance.types';

type Props = {
  rows: RosterRow[];
  total: number;
};

/** Counted over the loaded page rather than the day, because the roster returns
 *  no day-level totals - and a number that quietly meant "this page" would be
 *  the exact number HR would trust to sign a month off. Hence the label. */
export function RosterDaySummary({ rows, total }: Props) {
  const marked = rows.filter(row => row.isMarked).length;
  const unmarked = rows.length - marked;
  const conflicts = rows.filter(row => row.hasConflict).length;
  const noShift = rows.filter(row => row.noShiftAssigned).length;

  return (
    <div className="m-panel m-panel-shine mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-3 px-4 py-3.5">
      <span className="meta-label text-text-low">
        On this page
      </span>

      <Metric label="Marked" value={marked} />
      <Metric label="Unmarked" value={unmarked} tone={unmarked ? 'awaiting' : undefined} />
      <Metric label="Conflicts" value={conflicts} tone={conflicts ? 'overdue' : undefined} />
      <Metric label="No shift" value={noShift} tone={noShift ? 'awaiting' : undefined} />

      <span data-numeric className="ml-auto text-[12px] text-text-low">
        {rows.length} of {total.toLocaleString('en-IN')} employees
      </span>
    </div>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: 'awaiting' | 'overdue';
}) {
  return (
    <span className="flex items-baseline gap-1.5">
      <span className="meta-label text-text-low">
        {label}
      </span>
      <span
        data-numeric
        className={cn(
          'text-[15px] font-medium',
          tone === 'awaiting' && 'text-awaiting',
          tone === 'overdue' && 'text-overdue',
          !tone && 'text-text-hi'
        )}
      >
        {value}
      </span>
    </span>
  );
}
