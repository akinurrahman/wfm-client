import type { AttendanceStatus, DayType, PeriodStatus } from '@/features/attendance';
import type { PlannedAbsenceStatus } from '@/features/leave';

/** The board's own subject, restated so a tab left open overnight is
 *  distinguishable from a live one. */
export type DashboardAsOf = {
  date: string;
  /** Business today, resolved on the server against the office offset rather
   *  than against the viewer's clock. */
  today: string;
  isToday: boolean;
  isFuture: boolean;
};

/** The declared period covering the day, or null. Null is not an error: nothing
 *  pre-creates periods, and an uncovered date is OPEN by the attendance rule. */
export type DashboardPeriod = {
  id: string;
  /** The label a payslip prints, never the boundary. Read `startDate` and
   *  `endDate` for the window. */
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  status: PeriodStatus;
  lockedAt: string | null;
};

export type DashboardCycle = {
  startDate: string;
  endDate: string;
  /** False when no period exists and the calendar month was used instead. */
  isDeclaredPeriod: boolean;
};

export type DashboardEmployeeRef = {
  id: string;
  /** The badge code, e.g. `EMP0042`. */
  employeeId: string;
  fullName: string;
};

export type DashboardLeaveType = {
  id: string;
  code: string;
  name: string;
  isPaid: boolean;
};

export type DashboardAbsence = {
  id: string;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  reason: string;
  createdAt: string;
  leaveType: DashboardLeaveType;
};

/** The admin board names whose request it is; the employee board does not need
 *  to and instead says where the request has got to. */
export type AdminAbsence = DashboardAbsence & { employee: DashboardEmployeeRef };

export type MyAbsence = DashboardAbsence & { status: PlannedAbsenceStatus };

export type DashboardHoliday = {
  id: string;
  /** An array because festivals collide on one calendar day. */
  names: string[];
  date: string;
  isOptional: boolean;
  createdAt: string;
  updatedAt: string;
};

export type DashboardHolidaySummary = {
  id: string;
  date: string;
  names: string[];
  isOptional: boolean;
};

export type DashboardBirthday = DashboardEmployeeRef & {
  dateOfBirth: string;
  /** `MM-DD`, which is what the look-ahead actually matches on. */
  monthDay: string;
  isToday: boolean;
};

/** Always fully populated and zero-filled. A missing key is a bug, not an empty
 *  bucket, which is why these are Records and not Partials. */
export type AttendanceStatusCounts = Record<AttendanceStatus, number>;

export type DayTypeCounts = Record<DayType, number>;

export type DashboardFilters = {
  date: string;
  /** Look-ahead horizon for birthdays and not-yet-started leave, 1 to 90. */
  upcomingDays: number;
};

/** The admin board takes a third param, the length of its trend series. The
 *  employee board ignores it, so its key must not carry it or changing the
 *  trend length would refetch a board it cannot change. */
export type AdminDashboardFilters = DashboardFilters & {
  trendDays: number;
};
