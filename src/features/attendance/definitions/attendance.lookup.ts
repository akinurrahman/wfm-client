import { createLookup } from '@/lib/lookup';

/** Held apart so the roster's seventh state can extend the six the database
 *  stores without restating any of their metadata. */
const ATTENDANCE_STATUS = {
  PRESENT: { label: 'Present', badgeVariant: 'settled' },
  HALF_DAY: { label: 'Half day', badgeVariant: 'awaiting' },
  ABSENT: { label: 'Absent', badgeVariant: 'overdue' },
  ON_LEAVE: { label: 'On leave', badgeVariant: 'default' },
  NOT_APPLICABLE: { label: 'Not applicable', badgeVariant: 'secondary' },
  MISSING_CHECKOUT: { label: 'Missing checkout', badgeVariant: 'awaiting' },
};

export const attendanceStatusLookup = createLookup(ATTENDANCE_STATUS, 'AttendanceStatus');

export type AttendanceStatus = (typeof attendanceStatusLookup.values)[number];

/** The roster answers for days no `Attendance` row exists for, so it returns a
 *  seventh value the database enum has no room for. */
export const rosterStatusLookup = createLookup(
  { ...ATTENDANCE_STATUS, NOT_MARKED: { label: 'Not marked', badgeVariant: 'outline' } },
  'RosterStatus'
);

export type RosterStatus = (typeof rosterStatusLookup.values)[number];

/** The only two statuses HR may assert. The rest are conclusions the arithmetic
 *  reaches, not assertions, and the API rejects them outright. */
export const markStatusLookup = createLookup(
  { ABSENT: ATTENDANCE_STATUS.ABSENT, ON_LEAVE: ATTENDANCE_STATUS.ON_LEAVE },
  'MarkStatus'
);

export type MarkStatus = (typeof markStatusLookup.values)[number];

export const dayTypeLookup = createLookup(
  {
    WORKING: { label: 'Working', badgeVariant: 'secondary' },
    WEEKLY_OFF: { label: 'Weekly off', badgeVariant: 'outline' },
    HOLIDAY: { label: 'Holiday', badgeVariant: 'default' },
  },
  'DayType'
);

export type DayType = (typeof dayTypeLookup.values)[number];

export const attendanceSourceLookup = createLookup(
  {
    SYSTEM: { label: 'System', badgeVariant: 'secondary' },
    DEVICE: { label: 'Device', badgeVariant: 'secondary' },
    MANUAL: { label: 'HR', badgeVariant: 'outline' },
  },
  'AttendanceSource'
);

export type AttendanceSource = (typeof attendanceSourceLookup.values)[number];

export const compensationTypeLookup = createLookup(
  {
    PAID_EXTRA: { label: 'Paid extra', badgeVariant: 'secondary' },
    COMP_OFF: { label: 'Comp off', badgeVariant: 'secondary' },
  },
  'HolidayCompensation'
);

export type CompensationType = (typeof compensationTypeLookup.values)[number];

/** Which half of the mark form is in play. The API takes one or the other and
 *  rejects both together, so the choice is a field the form has to hold. */
export const markModeLookup = createLookup(
  {
    time: { label: 'Enter times', badgeVariant: 'secondary' },
    status: { label: 'Set a status', badgeVariant: 'secondary' },
  },
  'MarkMode'
);

export type MarkMode = (typeof markModeLookup.values)[number];
