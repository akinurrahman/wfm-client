const DAY_MINUTES = 24 * 60;
const AXIS_HOURS = [6, 12, 18];

type Props = {
  /** minutes past midnight */
  start: number;
  end: number;
  label: string;
};

/** A shift drawn against the whole day rather than written out, so a glance
 *  down the column reads as coverage instead of five separate strings. */
export function ShiftSpan({ start, end, label }: Props) {
  // ending before it starts means the shift ran through midnight, so it draws
  // as two segments instead of one that wraps off the end of the track
  const segments = end > start ? [[start, end]] : [
    [start, DAY_MINUTES],
    [0, end],
  ];

  return (
    <div className="w-full max-w-[190px]">
      <span className="font-mono text-[12px] text-text-mid">{label}</span>

      <div
        aria-hidden="true"
        className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-surface-3"
      >
        {AXIS_HOURS.map(hour => (
          <span
            key={hour}
            className="absolute inset-y-0 w-px bg-hairline-strong"
            style={{ left: `${(hour / 24) * 100}%` }}
          />
        ))}

        {segments.map(([from, to]) => (
          <span
            key={from}
            className="absolute inset-y-0 rounded-full bg-brand"
            style={{
              left: `${(from / DAY_MINUTES) * 100}%`,
              width: `${((to - from) / DAY_MINUTES) * 100}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
