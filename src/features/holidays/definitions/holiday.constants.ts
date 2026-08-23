import { defineUrlFilters } from '@/systems/filters';

import type { HolidayFilters } from './holiday.types';

export const HOLIDAY_KEYS = {
  all: ['holidays'] as const,
  lists: () => [...HOLIDAY_KEYS.all, 'list'] as const,
  list: (filters: HolidayFilters) => [...HOLIDAY_KEYS.lists(), filters] as const,
};

export const HOLIDAY_KIND_OPTIONS = [
  { value: 'false', label: 'Public' },
  { value: 'true', label: 'Optional' },
] as const;

const YEAR_MIN = 1970;
const YEAR_MAX = 2999;

/** A window around today rather than the API's full 1970-2999 range, which no
 *  dropdown should ever render. */
export const holidayYearOptions = () => {
  const current = new Date().getFullYear();
  return Array.from({ length: 7 }, (_, index) => {
    const year = current - 2 + index;
    return { value: String(year), label: String(year) };
  });
};

/** Resolved once per mount, not at module load, so a session left open across
 *  new year does not silently keep querying the old one mid-interaction. */
export const HOLIDAY_FILTER_SPEC = defineUrlFilters<HolidayFilters>({
  year: {
    kind: 'number',
    min: YEAR_MIN,
    max: YEAR_MAX,
    defaultValue: () => new Date().getFullYear(),
  },
  isOptional: { values: HOLIDAY_KIND_OPTIONS.map(option => option.value) },
});

export const HOLIDAY_NAME_MAX = 150;
export const HOLIDAY_NAMES_MAX = 5;
