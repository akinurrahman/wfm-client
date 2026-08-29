import { addMonths, format } from 'date-fns';

import { defineUrlFilters, pagingSpec } from '@/systems/filters';

import type { MonthlyFilters } from './attendance-monthly.types';
import type { AttendanceStatus } from './attendance.lookup';

/** Deliberately nested under the roster's `['attendance']` root: a derive or a
 *  close rewrites whole ranges of days and invalidates that branch, and the
 *  sheet reading those same days has to go with it. */
export const MONTHLY_KEYS = {
  all: ['attendance', 'monthly'] as const,
  sheets: () => [...MONTHLY_KEYS.all, 'sheet'] as const,
  sheet: (filters: MonthlyFilters) => [...MONTHLY_KEYS.sheets(), filters] as const,
};

const YEAR_MIN = 2000;
const YEAR_MAX = 2999;

/** A window around today rather than the API's full 2000-2999 range, which no
 *  dropdown should ever render. */
export const monthlyYearOptions = () => {
  const current = new Date().getFullYear();
  return Array.from({ length: 5 }, (_, index) => {
    const year = current - 3 + index;
    return { value: String(year), label: String(year) };
  });
};

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: String(index + 1),
  label: format(new Date(2000, index, 1), 'MMMM'),
}));

/** How a cycle is named everywhere it is referred to. The label is not the
 *  window: a 26th-to-25th cycle labelled August starts in July. */
export const cycleLabel = (year: number, month: number) =>
  format(new Date(year, month - 1, 1), 'MMMM yyyy');

/** Steps a year and month label together, so December steps to January of the
 *  next year rather than to month 13. */
export const shiftCycle = (year: number, month: number, delta: number) => {
  const next = addMonths(new Date(year, month - 1, 1), delta);
  return { year: next.getFullYear(), month: next.getMonth() + 1 };
};

/** Both bounds are resolved once per mount, so a tab left open across a month
 *  boundary does not silently start reading a different cycle mid-review. */
export const MONTHLY_FILTER_SPEC = defineUrlFilters<MonthlyFilters>({
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
  ...pagingSpec(25, 100),
});

/** A month is 31 columns wide, so a cell gets one glyph. Keyed by the status
 *  union, so a value the API adds fails to compile rather than rendering blank. */
export const MONTHLY_CELL_CODE: Record<AttendanceStatus, string> = {
  PRESENT: 'P',
  HALF_DAY: 'H',
  ABSENT: 'A',
  ON_LEAVE: 'L',
  NOT_APPLICABLE: 'N',
  MISSING_CHECKOUT: 'M',
};

/** Colour is never the only signal here - the glyph above carries the meaning
 *  and this only reinforces it. */
export const MONTHLY_CELL_TONE: Record<AttendanceStatus, string> = {
  PRESENT: 'border-settled/30 bg-settled-soft text-settled',
  HALF_DAY: 'border-awaiting/30 bg-awaiting-soft text-awaiting',
  ABSENT: 'border-overdue/30 bg-overdue-soft text-overdue',
  ON_LEAVE: 'border-brand-line bg-brand-soft text-brand',
  NOT_APPLICABLE: 'border-hairline bg-surface-3 text-text-low',
  MISSING_CHECKOUT: 'border-awaiting/30 bg-awaiting-soft text-awaiting',
};
