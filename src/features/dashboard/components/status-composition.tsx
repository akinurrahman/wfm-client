import { cn } from '@/lib/utils';

import type { AttendanceStatusCounts } from '../definitions/dashboard.types';
import { ChartLegend, type LegendEntry } from './chart-legend';
import { statusLabel, STATUS_FILL, STATUS_HATCH, STATUS_STACK_ORDER } from './chart-palette';

type Props = {
  counts: AttendanceStatusCounts;
  /** The whole the segments are part of. Anything the statuses do not account
   *  for stays as bare track rather than being drawn as a status. */
  total: number;
  /** What the bare remainder means, e.g. days nobody has decided. */
  remainderLabel: string;
  caption: string;
};

/** The one chart on the board that is provably complete: these segments plus
 *  the remainder sum to the whole, exactly. */
export function StatusComposition({ counts, total, remainderLabel, caption }: Props) {
  const marked = STATUS_STACK_ORDER.reduce((sum, status) => sum + (counts[status] ?? 0), 0);
  const remainder = Math.max(total - marked, 0);
  const present = STATUS_STACK_ORDER.filter(status => (counts[status] ?? 0) > 0);

  const share = (value: number) => (total ? Math.round((value / total) * 100) : 0);

  const entries: LegendEntry[] = present.map(status => ({
    key: status,
    label: statusLabel(status),
    className: STATUS_FILL[status],
    style: { backgroundImage: STATUS_HATCH[status] },
    value: counts[status],
  }));

  if (remainder) {
    entries.push({
      key: 'remainder',
      label: remainderLabel,
      className: 'bg-surface-3',
      value: remainder,
    });
  }

  return (
    <div className="space-y-3">
      <p className="text-[13px] text-text-mid">{caption}</p>

      {/* 2px surface gaps do the separating, so no segment carries a border. */}
      <div className="flex h-2.5 w-full gap-[2px] overflow-hidden rounded-full bg-surface-3">
        {present.map(status => (
          <div
            key={status}
            title={`${statusLabel(status)}: ${counts[status]} of ${total} (${share(counts[status])}%)`}
            style={{ flexGrow: counts[status], backgroundImage: STATUS_HATCH[status] }}
            className={cn('h-full min-w-[3px] shrink-0 basis-0', STATUS_FILL[status])}
          />
        ))}

        {remainder ? (
          <div
            title={`${remainderLabel}: ${remainder} of ${total} (${share(remainder)}%)`}
            style={{ flexGrow: remainder }}
            className="h-full basis-0 bg-surface-3"
          />
        ) : null}
      </div>

      <ChartLegend entries={entries} />
    </div>
  );
}
