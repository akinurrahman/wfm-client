import { cn } from '@/lib/utils';

export type ResultMetric = {
  label: string;
  value: number;
  tone?: 'awaiting' | 'overdue' | 'settled';
};

type Props = {
  items: ResultMetric[];
};

/** What a repair pass actually did, stated as figures. Both passes answer the
 *  same question - how much moved - so they read the same way. */
export function AttendanceResultMetrics({ items }: Props) {
  return (
    <dl className="flex flex-wrap items-baseline gap-x-6 gap-y-3 rounded-lg border border-hairline bg-surface-2 px-3.5 py-3">
      {items.map(item => (
        <div key={item.label} className="flex items-baseline gap-1.5">
          <dt className="meta-label text-text-low">
            {item.label}
          </dt>
          <dd
            data-numeric
            className={cn(
              'text-[15px] font-medium',
              item.tone === 'awaiting' && 'text-awaiting',
              item.tone === 'overdue' && 'text-overdue',
              item.tone === 'settled' && 'text-settled',
              !item.tone && 'text-text-hi'
            )}
          >
            {item.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
