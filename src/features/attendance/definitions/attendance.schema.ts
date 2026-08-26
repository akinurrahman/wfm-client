import { z } from 'zod';

import { TIME_PATTERN } from '@/lib/time';

import { REMARK_MAX } from './attendance.constants';
import { compensationTypeLookup, markModeLookup, markStatusLookup } from './attendance.lookup';
import type { AttendanceMarkInput } from './attendance.types';

const clockTime = z
  .string()
  .regex(TIME_PATTERN, 'Use a time like 09:15')
  .optional()
  .or(z.literal(''));

export const markFormSchema = z
  .object({
    mode: markModeLookup.toZodEnum(),
    checkIn: clockTime,
    checkOut: clockTime,
    status: markStatusLookup.toZodEnum('Pick a status').optional(),
    leaveTypeId: z.string().optional(),
    compensationType: compensationTypeLookup.toZodEnum().optional().or(z.literal('')),
    remark: z
      .string()
      .trim()
      .min(1, 'A remark is required - this write overrules the device')
      .max(REMARK_MAX, `Keep the remark under ${REMARK_MAX} characters`),
  })
  .superRefine((values, ctx) => {
    if (values.mode === markModeLookup.keys.time) {
      if (!values.checkIn && !values.checkOut) {
        ctx.addIssue({
          code: 'custom',
          path: ['checkIn'],
          message: 'Enter a check in, a check out, or both',
        });
      }
      return;
    }

    if (!values.status) {
      ctx.addIssue({ code: 'custom', path: ['status'], message: 'Pick a status' });
      return;
    }

    if (values.status === markStatusLookup.keys.ON_LEAVE && !values.leaveTypeId) {
      ctx.addIssue({
        code: 'custom',
        path: ['leaveTypeId'],
        message: 'Leave has to say which leave type it draws on',
      });
    }
  });

export type MarkFormValues = z.infer<typeof markFormSchema>;

/** Mode is a question the form asks, not a field the wire takes: sending both
 *  halves is rejected, so only the chosen one crosses. */
export const toMarkPayload = (values: MarkFormValues): AttendanceMarkInput => {
  if (values.mode === markModeLookup.keys.time) {
    return {
      checkIn: values.checkIn || undefined,
      checkOut: values.checkOut || undefined,
      compensationType: values.compensationType || undefined,
      remark: values.remark,
    };
  }

  return {
    status: values.status,
    leaveTypeId:
      values.status === markStatusLookup.keys.ON_LEAVE ? values.leaveTypeId : undefined,
    remark: values.remark,
  };
};
