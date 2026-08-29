import { z } from 'zod';

import type { MyLeaveApplyPayload } from './my-leave.types';
import { REASON_MAX } from './planned-absence.constants';

export const myLeaveApplySchema = z
  .object({
    leaveTypeId: z.string().min(1, { error: 'Pick a leave type' }),
    startDate: z.string().min(1, { error: 'Pick the first day of the leave' }),
    endDate: z.string().min(1, { error: 'Pick the last day of the leave' }),
    isHalfDay: z.boolean(),
    reason: z
      .string()
      .trim()
      .min(1, { error: 'Say what the leave is for' })
      .max(REASON_MAX, { error: `Keep this under ${REASON_MAX} characters` }),
  })
  .refine(values => !values.startDate || !values.endDate || values.startDate <= values.endDate, {
    error: 'The leave cannot end before it starts',
    path: ['endDate'],
  });

export type MyLeaveApplyValues = z.infer<typeof myLeaveApplySchema>;

/** The flag only travels on a single day: the API rejects it on a range rather
 *  than ignoring it, and the switch is only on screen while the range is one
 *  day long. */
export const toMyLeaveApplyPayload = (values: MyLeaveApplyValues): MyLeaveApplyPayload => ({
  leaveTypeId: values.leaveTypeId,
  startDate: values.startDate,
  endDate: values.endDate,
  reason: values.reason.trim(),
  ...(values.startDate === values.endDate ? { isHalfDay: values.isHalfDay } : {}),
});
