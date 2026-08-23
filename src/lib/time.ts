/** Shifts store their boundaries as minutes from midnight (0..1439), not
 *  strings, so every screen that shows or edits one converts through here. */

const MINUTES_IN_DAY = 24 * 60;

/** A complete, zero-padded 24h wall-clock time. Shared so a schema and a
 *  live summary cannot disagree about what counts as finished input. */
export const TIME_PATTERN = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;

export const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(':');
  return Number(hours) * 60 + Number(minutes);
};

/** A shift that ends before it starts has crossed midnight. */
export const isNightShift = (startMinutes: number, endMinutes: number) =>
  endMinutes < startMinutes;

/** Span in minutes, counting a night shift through midnight rather than as a
 *  negative number. */
export const shiftSpanMinutes = (startMinutes: number, endMinutes: number) =>
  isNightShift(startMinutes, endMinutes)
    ? MINUTES_IN_DAY - startMinutes + endMinutes
    : endMinutes - startMinutes;

/** "8h 30m", for a duration already expressed in minutes. */
export const formatDuration = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) return `${rest}m`;
  return rest ? `${hours}h ${rest}m` : `${hours}h`;
};

export const WEEKDAYS = [
  { value: '0', label: 'Sun' },
  { value: '1', label: 'Mon' },
  { value: '2', label: 'Tue' },
  { value: '3', label: 'Wed' },
  { value: '4', label: 'Thu' },
  { value: '5', label: 'Fri' },
  { value: '6', label: 'Sat' },
] as const;

export const weekdayLabel = (day: number) => WEEKDAYS[day]?.label ?? String(day);

/** A `@db.Date` column comes back as `2026-11-08T00:00:00.000Z`. Slicing beats
 *  parsing here: any timezone west of UTC would render midnight UTC as the day
 *  before. */
export const toCalendarDate = (value: string | null | undefined) =>
  value ? String(value).slice(0, 10) : '';
