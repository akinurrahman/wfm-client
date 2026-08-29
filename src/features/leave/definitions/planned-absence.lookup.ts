import { createLookup } from '@/lib/lookup';

/** Two ways in, and they land in different places: an employee applies and the
 *  request waits at PENDING, HR files one and it is APPROVED on arrival. Only
 *  APPROVED is visible to attendance, so PENDING changes no day.
 *
 *  pending -> approved | rejected | cancelled, approved -> cancelled.
 *  REJECTED is terminal: it authorised nothing, so there is nothing to undo. */
export const plannedAbsenceStatusLookup = createLookup(
  {
    PENDING: { label: 'Pending', badgeVariant: 'awaiting' },
    APPROVED: { label: 'Approved', badgeVariant: 'settled' },
    REJECTED: { label: 'Rejected', badgeVariant: 'overdue' },
    CANCELLED: { label: 'Cancelled', badgeVariant: 'secondary' },
  },
  'PlannedAbsenceStatus'
);

export type PlannedAbsenceStatus = (typeof plannedAbsenceStatusLookup.values)[number];
