import type { SummaryCounts } from './attendance-monthly.types';
import type { PeriodStatus } from './attendance-period.lookup';
import type { RosterEmployee } from './attendance.types';

export type { PeriodStatus };

export type AttendancePeriod = {
  id: string;
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
  lockedById: string | null;
  lockedAt: string | null;
  unlockedById: string | null;
  unlockedAt: string | null;
  unlockReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export type PeriodFilters = {
  page: number;
  limit: number;
  year?: number;
  status?: PeriodStatus;
};

/** Both dates or neither. Omitting them defaults the cycle to the calendar
 *  month; supplying one alone is rejected. */
export type PeriodPayload = {
  year: number;
  month: number;
  startDate?: string;
  endDate?: string;
};

export type PeriodLockResult = {
  periodId: string;
  year: number;
  month: number;
  version: number;
  employeesSummarised: number;
  employeesSkipped: number;
  lockedAt: string;
};

export type PeriodUnlockPayload = {
  unlockReason: string;
};

/** What payroll reads. Relocking never overwrites: the old rows go
 *  `isCurrent: false` and a new version is inserted beside them. */
export type PeriodSummaryRow = SummaryCounts & {
  id: string;
  employeeId: string;
  periodId: string;
  version: number;
  isCurrent: boolean;
  generatedAt: string;
  generatedById: string | null;
  employee: RosterEmployee;
};

export type PeriodSummaryFilters = {
  page: number;
  limit: number;
  /** Defaults to the current version. Only an inspection of a superseded
   *  snapshot names one. */
  version?: number;
};
