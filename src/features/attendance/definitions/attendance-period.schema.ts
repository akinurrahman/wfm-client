import { z } from 'zod';

import { UNLOCK_REASON_MAX, UNLOCK_REASON_MIN } from './attendance-period.constants';
import type { PeriodPayload } from './attendance-period.types';

export const periodFormSchema = z
  .object({
    year: z.string().min(1, { error: 'Pick a year' }),
    month: z.string().min(1, { error: 'Pick a month' }),
    hasCustomWindow: z.boolean(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
  })
  .refine(values => !values.hasCustomWindow || Boolean(values.startDate), {
    error: 'Pick the day the cycle starts',
    path: ['startDate'],
  })
  .refine(values => !values.hasCustomWindow || Boolean(values.endDate), {
    error: 'Pick the day the cycle ends',
    path: ['endDate'],
  })
  .refine(
    values =>
      !values.hasCustomWindow ||
      !values.startDate ||
      !values.endDate ||
      values.startDate <= values.endDate,
    { error: 'The cycle cannot end before it starts', path: ['endDate'] }
  );

export type PeriodFormValues = z.infer<typeof periodFormSchema>;

/** The API takes both dates or neither, so the switch decides whether they
 *  travel at all rather than the fields being cleared behind it. */
export const toPeriodPayload = (values: PeriodFormValues): PeriodPayload => ({
  year: Number(values.year),
  month: Number(values.month),
  ...(values.hasCustomWindow
    ? { startDate: values.startDate, endDate: values.endDate }
    : {}),
});

export const periodUnlockSchema = z.object({
  unlockReason: z
    .string()
    .trim()
    .min(UNLOCK_REASON_MIN, {
      error: `Say what arrived late, in at least ${UNLOCK_REASON_MIN} characters`,
    })
    .max(UNLOCK_REASON_MAX, { error: `Keep this under ${UNLOCK_REASON_MAX} characters` }),
});

export type PeriodUnlockValues = z.infer<typeof periodUnlockSchema>;
