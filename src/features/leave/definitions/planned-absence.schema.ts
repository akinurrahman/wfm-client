import { z } from 'zod';

import { REASON_MAX } from './planned-absence.constants';
import type {
  PlannedAbsenceCancelPayload,
  PlannedAbsencePayload,
  PlannedAbsenceRejectPayload,
} from './planned-absence.types';

export const plannedAbsenceFormSchema = z
  .object({
    employeeId: z.string().min(1, { error: 'Pick an employee' }),
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

export type PlannedAbsenceFormValues = z.infer<typeof plannedAbsenceFormSchema>;

/** The API rejects `isHalfDay` on a range rather than ignoring it, so the flag
 *  only travels when the absence is one day long. Dropping it here rather than
 *  failing validation: the switch is only on screen for a single day, and an
 *  error on a hidden field is an error nobody can see. */
export const toPlannedAbsencePayload = (
  values: PlannedAbsenceFormValues
): PlannedAbsencePayload => ({
  employeeId: values.employeeId,
  leaveTypeId: values.leaveTypeId,
  startDate: values.startDate,
  endDate: values.endDate,
  reason: values.reason.trim(),
  ...(values.startDate === values.endDate ? { isHalfDay: values.isHalfDay } : {}),
});

export const plannedAbsenceCancelSchema = z.object({
  cancelReason: z
    .string()
    .trim()
    .min(1, { error: 'Say why the leave is being withdrawn' })
    .max(REASON_MAX, { error: `Keep this under ${REASON_MAX} characters` }),
});

export type PlannedAbsenceCancelValues = z.infer<typeof plannedAbsenceCancelSchema>;

export const toCancelPayload = (
  values: PlannedAbsenceCancelValues
): PlannedAbsenceCancelPayload => ({
  cancelReason: values.cancelReason.trim(),
});

export const plannedAbsenceRejectSchema = z.object({
  rejectReason: z
    .string()
    .trim()
    .min(1, { error: 'Say why the request is being turned down' })
    .max(REASON_MAX, { error: `Keep this under ${REASON_MAX} characters` }),
});

export type PlannedAbsenceRejectValues = z.infer<typeof plannedAbsenceRejectSchema>;

export const toRejectPayload = (
  values: PlannedAbsenceRejectValues
): PlannedAbsenceRejectPayload => ({
  rejectReason: values.rejectReason.trim(),
});
