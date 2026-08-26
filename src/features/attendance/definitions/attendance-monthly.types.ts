import type { Paginated } from '@/lib/api/types';

import type { PeriodStatus } from './attendance-period.lookup';
import type { AttendanceStatus, DayType } from './attendance.lookup';
import type { RosterEmployee } from './attendance.types';

/** The seven buckets every eligible day lands in exactly one of, plus the
 *  overlays and the minute totals. The monthly sheet and the lock snapshot run
 *  the same arithmetic, so both read this shape. */
export type SummaryCounts = {
  eligibleDays: number;
  presentDays: number;
  halfDays: number;
  absentDays: number;
  paidLeaveDays: number;
  unpaidLeaveDays: number;
  holidayCount: number;
  weeklyOffCount: number;
  /** Additional to a bucket, never instead of one. Never add these into a total. */
  holidayWorkedDays: number;
  weeklyOffWorkedDays: number;
  totalWorkedMinutes: number;
  totalLateMinutes: number;
  totalEarlyExitMinutes: number;
  normalOvertimeMinutes: number;
  holidayOvertimeMinutes: number;
  weeklyOffOvertimeMinutes: number;
};

/** One cell. Every day of the cycle comes back for every employee so the grid
 *  stays rectangular, which is why `eligible` exists separately from `status`. */
export type MonthlyDay = {
  date: string;
  /** False outside this employee's on-rolls window - a joiner or a leaver. */
  eligible: boolean;
  /** Null means nothing has decided this day. */
  attendanceId: string | null;
  dayType: DayType | null;
  status: AttendanceStatus | null;
  workedMinutes: number | null;
  overtimeMinutes: number | null;
  hasConflict: boolean;
};

export type MonthlyRow = {
  employee: RosterEmployee;
  eligibleDays: number;
  days: MonthlyDay[];
  /** Null when the employee was on rolls for no part of the cycle. */
  totals: SummaryCounts | null;
  /** False when the buckets do not sum to `eligibleDays`. The month will not
   *  lock until every row reconciles. */
  reconciles: boolean;
};

/** The cycle the year and month label resolved to. `id` is null until an
 *  AttendancePeriod is declared, in which case the calendar month was assumed. */
export type MonthlyCycle = {
  id: string | null;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
};

export type MonthlyFilters = {
  year: number;
  month: number;
  page: number;
  limit: number;
};

/** Paged by employee, and every page carries the resolved cycle in `stats`. */
export type MonthlySheet = Paginated<MonthlyRow> & {
  stats: { period: MonthlyCycle };
};
