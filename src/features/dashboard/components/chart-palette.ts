import { attendanceStatusLookup, type AttendanceStatus } from '@/features/attendance';
import type { EmployeeType } from '@/features/employees';

export const statusLabel = (status: AttendanceStatus) =>
  attendanceStatusLookup.resolve(status)?.label ?? status;

/** Stack order, not lookup order. Green and amber sit 6.7 apart under
 *  protanopia and must never touch, so leave is seated between them; reordering
 *  is free because a status has no rank. Validated at ΔE 18.6 deutan / 20.0
 *  normal on the adjacent pairs in both themes. */
export const STATUS_STACK_ORDER: AttendanceStatus[] = [
  'PRESENT',
  'ON_LEAVE',
  'HALF_DAY',
  'MISSING_CHECKOUT',
  'ABSENT',
  'NOT_APPLICABLE',
];

/** Fills come off the theme's status tokens rather than a categorical ramp: on
 *  these charts the colour means good or bad, not "series 4". */
export const STATUS_FILL: Record<AttendanceStatus, string> = {
  PRESENT: 'bg-settled',
  ON_LEAVE: 'bg-data',
  HALF_DAY: 'bg-awaiting',
  MISSING_CHECKOUT: 'bg-awaiting-soft',
  ABSENT: 'bg-overdue',
  NOT_APPLICABLE: 'bg-surface-3',
};

/** Missing checkout shares amber with half day on purpose - both mean the day
 *  is incomplete. A 45 degree hatch off the same ramp separates them without
 *  spending a second hue. */
export const STATUS_HATCH: Partial<Record<AttendanceStatus, string>> = {
  MISSING_CHECKOUT: 'repeating-linear-gradient(45deg, var(--amber) 0 3px, transparent 3px 6px)',
};

/** Employee type is ordinal - swapping skilled and unskilled would change the
 *  meaning - so it takes one hue in monotone steps rather than four identities.
 *  Mixed toward the panel surface, which is what makes the same four steps
 *  darken in the light theme and lighten in the dark one. Validated as a ramp:
 *  monotone L, every gap over 0.06, faintest step 2.44:1 dark / 2.02:1 light. */
const RAMP_MIX: Record<EmployeeType, number> = {
  HIGHLY_SKILLED: 100,
  SKILLED: 80,
  SEMI_SKILLED: 62,
  UNSKILLED: 46,
};

export const employeeTypeFill = (type: EmployeeType) => ({
  backgroundColor: `color-mix(in srgb, var(--data) ${RAMP_MIX[type]}%, var(--surface-1))`,
});

/** Gender is nominal, so it takes identities rather than a ramp. Two hues plus
 *  a neutral for the residual bucket, validated at ΔE 23.0 protan / 33.5
 *  normal. Deliberately not the status greens and reds: nothing here is good
 *  news or bad news. */
export const GENDER_FILL: Record<string, string> = {
  MALE: 'bg-data',
  FEMALE: 'bg-brand-fill',
  OTHER: 'bg-surface-3',
};
