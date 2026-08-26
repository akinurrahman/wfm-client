import { z } from 'zod';

const calendarDate = (message: string) =>
  z.string({ error: message }).regex(/^\d{4}-\d{2}-\d{2}$/, message);

export const deriveFormSchema = z
  .object({
    from: calendarDate('Pick a start date'),
    to: calendarDate('Pick an end date'),
    employeeCode: z.string().trim().optional(),
    force: z.boolean(),
  })
  .refine(values => values.from <= values.to, {
    error: 'The end date cannot fall before the start date',
    path: ['to'],
  });

export type DeriveFormValues = z.infer<typeof deriveFormSchema>;

export const closeFormSchema = z.object({
  date: calendarDate('Pick the day to close'),
});

export type CloseFormValues = z.infer<typeof closeFormSchema>;
