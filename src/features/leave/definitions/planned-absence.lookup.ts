import { createLookup } from '@/lib/lookup';

/** An absence is filed already approved, and cancel is the only move off that.
 *  There is no pending state: HR records the decision, it does not collect it. */
export const plannedAbsenceStatusLookup = createLookup(
  {
    APPROVED: { label: 'Approved', badgeVariant: 'settled' },
    CANCELLED: { label: 'Cancelled', badgeVariant: 'overdue' },
  },
  'PlannedAbsenceStatus'
);

export type PlannedAbsenceStatus = (typeof plannedAbsenceStatusLookup.values)[number];
