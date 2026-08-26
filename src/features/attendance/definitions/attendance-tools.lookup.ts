import { createLookup } from '@/lib/lookup';

/** Why a derive or close pass left an employee-day alone. Every one of these is
 *  rendered rather than counted: a silently dropped day is how a month reaches
 *  payroll short. */
export const skipReasonLookup = createLookup(
  {
    UNKNOWN_EMPLOYEE: { label: 'Unknown employee', badgeVariant: 'overdue' },
    NO_SHIFT_ASSIGNED: { label: 'No shift assigned', badgeVariant: 'awaiting' },
    NOT_ON_ROLLS: { label: 'Not on rolls', badgeVariant: 'secondary' },
    NO_PUNCHES: { label: 'No punches', badgeVariant: 'secondary' },
    PERIOD_LOCKED: { label: 'Period locked', badgeVariant: 'overdue' },
  },
  'SkipReason'
);

export type SkipReason = (typeof skipReasonLookup.values)[number];
