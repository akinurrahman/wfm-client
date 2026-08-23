import { formatDate } from '@/lib';

/** Reads as a drafting sheet because that is what a roster is: a day divided
 *  into spans, drawn to scale. Illustrative spans, real clock on the marker. */
const SHIFTS = [
  { label: 'Night', start: 0, end: 6, tone: 'covered' },
  { label: 'Early', start: 6, end: 14, tone: 'covered' },
  { label: 'Day', start: 9, end: 17, tone: 'covered' },
  { label: 'Late', start: 13, end: 21, tone: 'covered' },
  { label: 'Evening', start: 17, end: 24, tone: 'short' },
] as const;

const RULER_HOURS = [0, 4, 8, 12, 16, 20, 24];

const LABEL_COLUMN = '5.25rem';

// Full class strings, never interpolated, so Tailwind can see them.
const TONE = {
  covered: { bar: 'bg-brand/65 ring-brand-line', dot: 'bg-brand' },
  short: { bar: 'bg-awaiting/55 ring-awaiting/45', dot: 'bg-awaiting' },
} as const;

const clock = (hour: number) => `${String(hour % 24).padStart(2, '0')}:00`;

export function CoverageSchematic() {
  const now = new Date();
  const nowOffset = ((now.getHours() * 60 + now.getMinutes()) / (24 * 60)) * 100;

  return (
    <figure
      className="m-panel m-panel-shine px-5 pt-4 pb-5 shadow-lift"
      style={{
        animation: 'm-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) both',
        animationDelay: '120ms',
      }}
    >
      <figcaption className="flex items-baseline justify-between gap-4">
        <span className="font-mono text-[10px] tracking-[0.2em] text-text-mid uppercase">
          Coverage / 24h
        </span>
        <span className="tnum font-mono text-[10px] tracking-[0.14em] text-text-low uppercase">
          {formatDate(now, 'EEE dd MMM')}
        </span>
      </figcaption>

      <div
        className="relative mt-5 h-3"
        style={{ marginLeft: LABEL_COLUMN }}
      >
        {RULER_HOURS.map(hour => (
          <span
            key={hour}
            className="tnum absolute -translate-x-1/2 font-mono text-[9px] text-text-low"
            style={{ left: `${(hour / 24) * 100}%` }}
          >
            {String(hour).padStart(2, '0')}
          </span>
        ))}
      </div>

      <div className="relative mt-1.5">
        <div
          className="pointer-events-none absolute inset-y-0 right-0"
          style={{ left: LABEL_COLUMN }}
          aria-hidden="true"
        >
          {RULER_HOURS.map(hour => (
            <span
              key={hour}
              className="absolute inset-y-0 w-px bg-hairline"
              style={{ left: `${(hour / 24) * 100}%` }}
            />
          ))}
        </div>

        <ul className="relative space-y-1.5">
          {SHIFTS.map((shift, index) => (
            <li
              key={shift.label}
              className="grid items-center gap-3"
              style={{ gridTemplateColumns: `${LABEL_COLUMN} 1fr` }}
            >
              <div className="leading-tight">
                <span className="block text-[12px] font-medium text-text-hi">
                  {shift.label}
                </span>
                <span className="tnum block font-mono text-[9px] text-text-low">
                  {clock(shift.start)}-{clock(shift.end)}
                </span>
              </div>

              <div className="relative h-5">
                <div
                  className={`absolute inset-y-0 origin-left rounded-[4px] ring-1 ${TONE[shift.tone].bar}`}
                  style={{
                    left: `${(shift.start / 24) * 100}%`,
                    width: `${((shift.end - shift.start) / 24) * 100}%`,
                    animation:
                      'm-draw 620ms cubic-bezier(0.22, 1, 0.36, 1) both',
                    animationDelay: `${260 + index * 80}ms`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>

        <div
          className="pointer-events-none absolute inset-y-0 right-0"
          style={{ left: LABEL_COLUMN }}
          aria-hidden="true"
        >
          <span
            className="absolute inset-y-0 border-l border-dashed border-brand/70"
            style={{
              left: `${nowOffset}%`,
              animation: 'm-rise 500ms ease-out both',
              animationDelay: '720ms',
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4 border-t border-hairline pt-3">
        {(['covered', 'short'] as const).map(tone => (
          <span
            key={tone}
            className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.14em] text-text-low uppercase"
          >
            <span className={`size-1.5 rounded-full ${TONE[tone].dot}`} />
            {tone === 'covered' ? 'Covered' : 'Short staffed'}
          </span>
        ))}
        <span className="tnum ml-auto font-mono text-[9px] tracking-[0.14em] text-text-low uppercase">
          Now {formatDate(now, 'HH:mm')}
        </span>
      </div>
    </figure>
  );
}
