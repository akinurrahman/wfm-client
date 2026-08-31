import type { DesignationCategory } from '@/features/designations';
import type { EmployeeType, Gender } from '@/features/employees';

import type {
  AdminAbsence,
  AttendanceStatusCounts,
  DashboardAsOf,
  DashboardBirthday,
  DashboardCycle,
  DashboardHoliday,
  DashboardHolidaySummary,
  DashboardPeriod,
  DayTypeCounts,
} from './dashboard.types';

export type AdminHeadcount = {
  /** On rolls for the day described: joiners counted from their joining date,
   *  leavers through their last working day. The roster's row count cannot
   *  disagree with this. */
  onRolls: number;
  /** The `isActive` flag, which only ever answers for today. Differs from
   *  `onRolls` whenever the board is not describing today. */
  activeNow: number;
  joinedThisCycle: number;
  exitedThisCycle: number;
};

export type AdminAttendance = {
  byStatus: AttendanceStatusCounts;
  byDayType: DayTypeCounts;
  /** Days somebody has decided, which is the sum of `byStatus`. */
  marked: number;
  /** `onRolls` less `marked`. The number HR opens this screen for. */
  notMarked: number;
  lateArrivals: number;
  /** Counted over the whole cycle, not the day: a conflict sits unresolved
   *  until somebody opens it, and a day-scoped count would hide the backlog. */
  conflicts: number;
};

export type AdminLeave = {
  pendingRequests: number;
  onLeaveToday: number;
  /** Max 5, oldest first. */
  oldestPending: AdminAbsence[];
  /** Max 10, APPROVED only. Pending requests cannot answer the staffing
   *  question because they authorise nothing. */
  startingSoon: AdminAbsence[];
};

export type AdminCalendar = {
  /** The horizon actually applied, which the API may have clamped. */
  upcomingDays: number;
  holidayToday: DashboardHoliday | null;
  /** Next 5 from the day inclusive, capped by count rather than by horizon. */
  upcomingHolidays: DashboardHolidaySummary[];
  birthdays: DashboardBirthday[];
};

/** One day of the site's attendance. A day nothing was recorded on comes back
 *  zeroed with `marked: 0`, which is a different statement from a day of
 *  absences, so it must be drawn as an empty column and never skipped. */
export type AdminTrendPoint = {
  date: string;
  byStatus: AttendanceStatusCounts;
  marked: number;
  workedMinutes: number;
  lateMinutes: number;
  overtimeMinutes: number;
};

export type AdminTrend = {
  from: string;
  to: string;
  /** The window actually applied. */
  days: number;
  /** One point per calendar day, ascending, gaps filled. Safe to index
   *  positionally. */
  series: AdminTrendPoint[];
};

export type AdminDesignationSlice = {
  id: string;
  /** "Unknown" only when a designation was deleted mid-request. The row is kept
   *  so the slices still sum to `headcount.onRolls`. */
  title: string;
  category: DesignationCategory | null;
  count: number;
};

/** The same people `headcount.onRolls` counts, cut three ways. */
export type AdminWorkforce = {
  /** Largest first. The order is part of the answer, so it is never re-sorted. */
  byDesignation: AdminDesignationSlice[];
  byEmployeeType: Record<EmployeeType, number>;
  byGender: Record<Gender, number>;
};

export type AdminDashboard = {
  asOf: DashboardAsOf;
  period: DashboardPeriod | null;
  cycle: DashboardCycle;
  headcount: AdminHeadcount;
  attendance: AdminAttendance;
  leave: AdminLeave;
  calendar: AdminCalendar;
  trend: AdminTrend;
  workforce: AdminWorkforce;
};
