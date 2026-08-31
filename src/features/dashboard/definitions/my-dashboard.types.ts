import type { Attendance, AttendanceStatus, DayType } from '@/features/attendance';
import type { DesignationCategory } from '@/features/designations';

import type {
  AttendanceStatusCounts,
  DashboardAsOf,
  DashboardCycle,
  DashboardHoliday,
  DashboardHolidaySummary,
  DashboardPeriod,
  DayTypeCounts,
  MyAbsence,
} from './dashboard.types';

export type MyDashboardShift = {
  id: string;
  code: string;
  name: string;
  /** Minutes from midnight on the business clock. */
  startMinutes: number;
  endMinutes: number;
  breakMinutes: number;
  graceMinutes: number;
  /** 0 is Sunday. */
  weeklyOffDays: number[];
};

export type MyDashboardEmployee = {
  id: string;
  employeeId: string;
  fullName: string;
  dateOfJoining: string;
  lastWorkingDay: string | null;
  isActive: boolean;
  designation: { id: string; title: string; category: DesignationCategory };
  /** Null for employees created before shifts existed, and a day with no shift
   *  cannot be judged at all. */
  shift: MyDashboardShift | null;
};

export type MyDashboardToday = {
  /** Null means nothing has decided this day yet. It is not absence. */
  attendance: Attendance | null;
  isHoliday: boolean;
  holiday: DashboardHoliday | null;
  /** The APPROVED absence covering the day, if there is one. */
  plannedAbsence: MyAbsence | null;
};

export type MyDashboardTotals = {
  workedMinutes: number;
  lateMinutes: number;
  earlyExitMinutes: number;
  overtimeMinutes: number;
};

/** The slice of a day the cycle series carries. Less than the stored row: enough
 *  to colour a column and give it a height. */
export type MyDashboardDayAttendance = {
  status: AttendanceStatus;
  dayType: DayType;
  workedMinutes: number;
  lateMinutes: number;
  earlyExitMinutes: number;
  overtimeMinutes: number;
};

export type MyDashboardDay = {
  date: string;
  /** Null for a day nobody has decided. It is a gap in the series, never a
   *  zero-hour day. */
  attendance: MyDashboardDayAttendance | null;
};

/** Counted off the attendance rows rather than off the locked payroll snapshot,
 *  which only exists once a cycle closes. Provisional by construction: "how am
 *  I doing so far", never "what will I be paid". */
export type MyDashboardMonthToDate = {
  from: string;
  to: string;
  /** Days decided so far. Days nobody has decided yet are absent from this
   *  count, so it is deliberately not an eligible-days figure. */
  markedDays: number;
  byStatus: AttendanceStatusCounts;
  byDayType: DayTypeCounts;
  totals: MyDashboardTotals;
  /** One entry per calendar day in the window, ascending, no dates missing. */
  days: MyDashboardDay[];
};

export type MyDashboardLeave = {
  pendingRequests: number;
  /** Max 5. PENDING and APPROVED together: "am I off next Tuesday" and "have I
   *  been told yet" are the same strip, discriminated on `status`. */
  upcoming: MyAbsence[];
  /** Max 5, newest first, any status. */
  recent: MyAbsence[];
};

export type MyDashboardCalendar = {
  upcomingDays: number;
  upcomingHolidays: DashboardHolidaySummary[];
};

export type MyDashboardAnnouncement = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  postedBy: { id: string; fullName: string };
};

export type MyDashboard = {
  asOf: DashboardAsOf;
  employee: MyDashboardEmployee;
  period: DashboardPeriod | null;
  cycle: DashboardCycle;
  today: MyDashboardToday;
  monthToDate: MyDashboardMonthToDate;
  leave: MyDashboardLeave;
  calendar: MyDashboardCalendar;
  /** Max 5, pinned first then newest. */
  announcements: MyDashboardAnnouncement[];
};
