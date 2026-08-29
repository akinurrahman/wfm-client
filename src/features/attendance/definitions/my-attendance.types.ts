import type { PlannedAbsenceStatus } from '@/features/leave';

import type { MonthlyCycle, MonthlyDay, SummaryCounts } from './attendance-monthly.types';
import type { RosterEmployee } from './attendance.types';

/** The absence a day is charged to. It survives the absence being withdrawn:
 *  the day keeps pointing at it until the reversion runs, and saying so is more
 *  honest than dropping the link. */
export type MyAttendanceLeave = {
  absenceId: string;
  code: string;
  name: string;
  isPaid: boolean;
  isHalfDay: boolean;
  status: PlannedAbsenceStatus;
};

/** The admin sheet's cell plus the two things only the reader of their own
 *  month needs: which festival a holiday was, and which leave paid for a day. */
export type MyAttendanceDay = MonthlyDay & {
  /** An array because two festivals can land on one date, and printing one of
   *  them is wrong on the day it matters. Null when the day is not a holiday. */
  holidayNames: string[] | null;
  leave: MyAttendanceLeave | null;
};

/** One employee, one cycle, one object: not paginated, and the period rides
 *  inside the payload rather than in a `stats` block. */
export type MyAttendanceMonth = {
  employee: RosterEmployee;
  eligibleDays: number;
  period: MonthlyCycle;
  days: MyAttendanceDay[];
  /** Null when the employee was on rolls for no part of the cycle. */
  totals: SummaryCounts | null;
  /** False when the buckets do not sum to the eligible days. Read as "under
   *  review", not as a number to trust. */
  reconciles: boolean;
};

export type MyAttendanceFilters = {
  year: number;
  month: number;
};
