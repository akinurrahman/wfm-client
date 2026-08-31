import { cn } from '@/lib/utils';

type GridProps = {
  /** Tiles per row from the desk breakpoint up. Below that they stack. */
  columns?: 3 | 4;
  className?: string;
  children: React.ReactNode;
};

/** Figures sit in one panel divided by hairlines rather than in a row of small
 *  cards. A card per number would put four borders around four integers and
 *  read as four things instead of one reading. */
export function StatGrid({ columns = 4, className, children }: GridProps) {
  return (
    <section
      className={cn(
        'm-panel m-panel-shine grid gap-px overflow-hidden bg-hairline sm:grid-cols-2',
        columns === 4 ? 'desk:grid-cols-4' : 'desk:grid-cols-3',
        className
      )}
    >
      {children}
    </section>
  );
}

type TileProps = {
  label: string;
  value: number | string;
  /** What the figure is counted over, in a few words. One line, always: the
   *  full sentence lives in `hint`, where it costs no height. */
  sub?: string;
  /** The long explanation, on hover. Every number here is counted over
   *  something, and the window is half the meaning. */
  hint?: string;
  tone?: 'settled' | 'awaiting' | 'overdue';
  icon?: React.ComponentType<{ className?: string }>;
  /** The figure the screen is opened for. Proportional figures, not tabular:
   *  equal-width digits read loose at this size. */
  emphasis?: boolean;
};

export function StatTile({ label, value, sub, hint, tone, icon: Icon, emphasis }: TileProps) {
  /** A zero is "nothing to do here". Keeping it at full weight makes an empty
   *  day look as loud as a busy one. */
  const isQuiet = !emphasis && !tone && (value === 0 || value === '0');

  return (
    <div title={hint} className="flex items-start gap-3 bg-surface-1 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="meta-label truncate text-text-low">{label}</p>

        <p
          data-numeric={emphasis ? undefined : true}
          className={cn(
            'display-title mt-1 truncate leading-none',
            emphasis ? 'text-[26px]' : 'text-[22px]',
            tone === 'settled' && 'text-settled',
            tone === 'awaiting' && 'text-awaiting',
            tone === 'overdue' && 'text-overdue',
            !tone && (isQuiet ? 'text-text-mid' : 'text-text-hi')
          )}
        >
          {value}
        </p>

        {sub ? (
          <p data-numeric className="mt-1 truncate text-[11px] text-text-low">
            {sub}
          </p>
        ) : null}
      </div>

      {Icon ? (
        <Icon
          className={cn(
            'mt-0.5 size-3.5 shrink-0',
            tone === 'settled' && 'text-settled',
            tone === 'awaiting' && 'text-awaiting',
            tone === 'overdue' && 'text-overdue',
            !tone && 'text-text-low'
          )}
        />
      ) : null}
    </div>
  );
}
