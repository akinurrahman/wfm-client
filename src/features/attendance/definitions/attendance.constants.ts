import { todayCalendarDate } from '@/lib/time';
import { defineUrlFilters, pagingSpec } from '@/systems/filters';

import type { AttendanceAuditFilters, RosterFilters } from './attendance.types';

export const ATTENDANCE_KEYS = {
  all: ['attendance'] as const,
  rosters: () => [...ATTENDANCE_KEYS.all, 'roster'] as const,
  roster: (filters: RosterFilters) => [...ATTENDANCE_KEYS.rosters(), filters] as const,
  audits: () => [...ATTENDANCE_KEYS.all, 'audit'] as const,
  audit: (id: string, filters: AttendanceAuditFilters) =>
    [...ATTENDANCE_KEYS.audits(), id, filters] as const,
};

/** `date` is required by the API and resolved once per mount, so a tab left
 *  open overnight does not silently start querying a different day mid-edit.
 *  Deliberately no status or name filter: the roster's job is to show everyone
 *  for the day, and hiding people is how a day goes out half marked. */
export const ROSTER_FILTER_SPEC = defineUrlFilters<RosterFilters>({
  date: { defaultValue: () => todayCalendarDate() },
  ...pagingSpec(25, 100),
});

export const REMARK_MAX = 500;

/** The API takes 1..200 entries and refuses the whole batch on one bad row, so
 *  the page size is kept well inside that. */
export const BULK_ENTRY_MAX = 200;

export const AUDIT_PAGE_SIZE = 10;
