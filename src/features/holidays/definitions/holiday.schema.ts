import { z } from 'zod';

import { HOLIDAY_NAME_MAX, HOLIDAY_NAMES_MAX } from './holiday.constants';

export const holidayFormSchema = z.object({
  names: z
    .array(z.string().trim().min(1).max(HOLIDAY_NAME_MAX, `Each name is limited to ${HOLIDAY_NAME_MAX} characters`))
    .min(1, 'Add at least one name')
    .max(HOLIDAY_NAMES_MAX, `A day can carry at most ${HOLIDAY_NAMES_MAX} names`),
  date: z
    .string({ error: 'Pick a date' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Pick a date'),
  isOptional: z.boolean(),
});

export type HolidayFormValues = z.infer<typeof holidayFormSchema>;
