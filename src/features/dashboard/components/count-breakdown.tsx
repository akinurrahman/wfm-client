import type { createLookup } from '@/lib/lookup';
import { cn } from '@/lib/utils';

type Lookup<T extends string> = ReturnType<typeof createLookup<T>>;

type Props<T extends string> = {
  lookup: Lookup<T>;
  /** Zero-filled by the API: every enum member is present, so the list is the
   *  whole enum and a gap would be a bug rather than an empty bucket. */
  counts: Record<T, number>;
  columns?: 2 | 3;
};

/** The table view every chart on this board is paired with. Zeroes stay on the
 *  page and go quiet instead of dropping out, so the shape is the same shape
 *  every day and the eye lands on what actually happened. */
export function CountBreakdown<T extends string>({ lookup, counts, columns = 3 }: Props<T>) {
  return (
    <dl
      className={cn(
        'grid grid-cols-2 gap-x-6 gap-y-3',
        columns === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'
      )}
    >
      {lookup.values.map(value => {
        const count = counts[value] ?? 0;

        return (
          <div
            key={value}
            className="flex items-baseline justify-between gap-3 border-b border-hairline pb-2"
          >
            <dt className={cn('meta-label truncate', count ? 'text-text-mid' : 'text-text-low')}>
              {lookup.resolve(value)?.label ?? value}
            </dt>
            <dd
              data-numeric
              className={cn('text-[15px] font-medium', count ? 'text-text-hi' : 'text-text-low')}
            >
              {count}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
