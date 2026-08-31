import { todayCalendarDate } from '@/lib/time';
import { defineUrlFilters } from '@/systems/filters';

import type { AdminDashboardFilters, DashboardFilters } from './dashboard.types';

export const UPCOMING_DAYS_DEFAULT = 7;
export const TREND_DAYS_DEFAULT = 30;

/** The API caps the horizon at 90: past that it is a report, not a dashboard. */
export const UPCOMING_DAYS_OPTIONS = [
  { value: '7', label: 'Next 7 days' },
  { value: '14', label: 'Next 14 days' },
  { value: '30', label: 'Next 30 days' },
  { value: '90', label: 'Next 90 days' },
];

/** Floor of 7 is the API's, and it is the right floor: a shorter window cannot
 *  show a full week, so every weekend would read as a collapse. */
export const TREND_DAYS_OPTIONS = [
  { value: '14', label: 'Last 14 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '60', label: 'Last 60 days' },
  { value: '90', label: 'Last 90 days' },
];

const dateField = { defaultValue: () => todayCalendarDate() };

const upcomingField = {
  kind: 'number' as const,
  min: 1,
  max: 90,
  defaultValue: UPCOMING_DAYS_DEFAULT,
};

/** `date` is resolved once per mount, so a tab left open overnight does not
 *  silently start describing a different day. */
export const DASHBOARD_FILTER_SPEC = defineUrlFilters<DashboardFilters>({
  date: dateField,
  upcomingDays: upcomingField,
});

export const ADMIN_DASHBOARD_FILTER_SPEC = defineUrlFilters<AdminDashboardFilters>({
  date: dateField,
  upcomingDays: upcomingField,
  trendDays: { kind: 'number', min: 7, max: 90, defaultValue: TREND_DAYS_DEFAULT },
});
