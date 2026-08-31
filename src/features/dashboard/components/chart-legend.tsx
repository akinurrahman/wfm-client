import { cn } from '@/lib/utils';

export type LegendEntry = {
  key: string;
  label: string;
  /** Tailwind fill class for the swatch. */
  className?: string;
  /** Inline fill for a hatch or a mixed ramp step. */
  style?: React.CSSProperties;
  value?: number | string;
};

/** The identity channel every chart on this board leans on. Present for two or
 *  more series without exception, so nothing is ever readable by colour alone. */
export function ChartLegend({ entries }: { entries: LegendEntry[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
      {entries.map(entry => (
        <li key={entry.key} className="flex items-center gap-1.5">
          <span
            aria-hidden
            style={entry.style}
            className={cn('size-2.5 shrink-0 rounded-sm', entry.className)}
          />
          <span className="text-[12px] text-text-mid">{entry.label}</span>
          {entry.value === undefined ? null : (
            <span data-numeric className="text-[12px] font-medium text-text-hi">
              {entry.value}
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
