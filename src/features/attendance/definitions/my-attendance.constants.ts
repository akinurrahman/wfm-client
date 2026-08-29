import { defineUrlFilters } from '@/systems/filters';

import type { MyAttendanceFilters } from './my-attendance.types';

/** Nested under the roster's `['attendance']` root: a derive, a close or an
 *  approved leave rewrites whole ranges of days, and the month reading those
 *  same days has to go with that branch. */
export const MY_ATTENDANCE_KEYS = {
  all: ['attendance', 'me'] as const,
  months: () => [...MY_ATTENDANCE_KEYS.all, 'month'] as const,
  month: (filters: MyAttendanceFilters) => [...MY_ATTENDANCE_KEYS.months(), filters] as const,
};

const YEAR_MIN = 2000;
const YEAR_MAX = 2999;

/** Both bounds are resolved once per mount, so a tab left open across a month
 *  boundary does not silently start reading a different cycle. */
export const MY_ATTENDANCE_FILTER_SPEC = defineUrlFilters<MyAttendanceFilters>({
  year: {
    kind: 'number',
    min: YEAR_MIN,
    max: YEAR_MAX,
    defaultValue: () => new Date().getFullYear(),
  },
  month: {
    kind: 'number',
    min: 1,
    max: 12,
    defaultValue: () => new Date().getMonth() + 1,
  },
});
