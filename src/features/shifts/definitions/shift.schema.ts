import { z } from 'zod';

import { TIME_PATTERN, timeToMinutes } from '@/lib/time';

import { SHIFT_CODE_MAX, SHIFT_NAME_MAX } from './shift.constants';


const clockTime = (label: string) =>
  z
    .string({ error: `${label} is required` })
    .regex(TIME_PATTERN, `${label} must be a time like 09:00`);

export const shiftFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, 'Name is required')
      .max(SHIFT_NAME_MAX, `Keep the name under ${SHIFT_NAME_MAX} characters`),
    code: z
      .string()
      .trim()
      .min(1, 'Code is required')
      .max(SHIFT_CODE_MAX, `Keep the code under ${SHIFT_CODE_MAX} characters`)
      .transform(value => value.toUpperCase()),
    // Held as wall-clock strings because that is what a person types and what
    // the time control speaks. The minutes the API wants are derived on submit.
    startTime: clockTime('Start time'),
    endTime: clockTime('End time'),
    breakMinutes: z.number().int().min(0, 'Break cannot be negative').max(720, 'Break cannot exceed 12 hours'),
    graceMinutes: z.number().int().min(0, 'Grace cannot be negative').max(240, 'Grace cannot exceed 4 hours'),
    weeklyOffDays: z
      .array(z.string())
      .max(6, 'At least one day has to be a working day'),
    isActive: z.boolean(),
  })
  .refine(values => values.startTime !== values.endTime, {
    error: 'A shift cannot start and end at the same minute',
    path: ['endTime'],
  });

export type ShiftFormValues = z.infer<typeof shiftFormSchema>;

/** The form speaks clock time and string day keys; the API speaks minutes and
 *  numbers. One mapping, one place. */
export const toShiftPayload = (values: ShiftFormValues) => ({
  name: values.name,
  code: values.code,
  startMinutes: timeToMinutes(values.startTime),
  endMinutes: timeToMinutes(values.endTime),
  breakMinutes: values.breakMinutes,
  graceMinutes: values.graceMinutes,
  weeklyOffDays: values.weeklyOffDays.map(Number).sort((a, b) => a - b),
  isActive: values.isActive,
});
