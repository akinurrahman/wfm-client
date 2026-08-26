import { createLookup } from '@/lib/lookup';

/** A period is born OPEN and only lock and unlock ever move it, so these two
 *  values are the whole lifecycle. */
export const periodStatusLookup = createLookup(
  {
    OPEN: { label: 'Open', badgeVariant: 'awaiting' },
    LOCKED: { label: 'Locked', badgeVariant: 'settled' },
  },
  'PeriodStatus'
);

export type PeriodStatus = (typeof periodStatusLookup.values)[number];
