import { z } from 'zod';

import { ADDRESS_LINE_MAX, FULL_NAME_MAX } from './employee.constants';
import { employeeTypeLookup, genderLookup } from './employee.lookup';
import type { EmployeeCreatePayload, EmployeeUpdatePayload } from './employee.types';

const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE = /^\d{7,15}$/;
const PIN = /^\d{4,10}$/;

const text = (label: string, max = 100) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `Keep ${label.toLowerCase()} under ${max} characters`);

const calendarDate = (label: string) =>
  z.string().regex(CALENDAR_DATE, `Pick ${label}`);

const phone = (label: string) =>
  z.string().trim().regex(PHONE, `${label} must be 7 to 15 digits, no spaces`);

export const employeeFormSchema = z.object({
  email: z.email('Enter a valid email address'),
  fullName: text('Full name', FULL_NAME_MAX),
  phoneNumber: phone('Phone number'),
  alternateNumber: phone('Alternate number').or(z.literal('')).optional(),
  dateOfBirth: calendarDate('a date of birth').refine(
    value => value <= new Date().toISOString().slice(0, 10),
    'A date of birth cannot be in the future'
  ),
  gender: genderLookup.toZodEnum('Pick a gender'),
  employeeType: employeeTypeLookup.toZodEnum('Pick an employee type'),
  designationId: z.string().min(1, 'Pick a designation'),
  dateOfJoining: calendarDate('a joining date'),
  // Optional on the API, required here: an employee with no shift is reported
  // as unrostered and every punch they make is ignored.
  shiftId: z.string().min(1, 'Pick a shift'),

  commAddressLine: text('Address line', ADDRESS_LINE_MAX),
  commCity: text('City'),
  commState: text('State'),
  commPin: z.string().trim().regex(PIN, 'Enter a PIN code, digits only'),
  commCountry: text('Country'),

  permAddressLine: text('Address line', ADDRESS_LINE_MAX),
  permCity: text('City'),
  permState: text('State'),
  permPin: z.string().trim().regex(PIN, 'Enter a PIN code, digits only'),
  permCountry: text('Country'),
});

export type EmployeeFormValues = z.infer<typeof employeeFormSchema>;

export const toEmployeeCreatePayload = (values: EmployeeFormValues): EmployeeCreatePayload => ({
  email: values.email,
  fullName: values.fullName,
  phoneNumber: values.phoneNumber,
  alternateNumber: values.alternateNumber?.trim() || undefined,
  dateOfBirth: values.dateOfBirth,
  gender: values.gender,
  employeeType: values.employeeType,
  designationId: values.designationId,
  dateOfJoining: values.dateOfJoining,
  shiftId: values.shiftId,
  commAddressLine: values.commAddressLine,
  commCity: values.commCity,
  commState: values.commState,
  commPin: values.commPin,
  commCountry: values.commCountry,
  permAddressLine: values.permAddressLine,
  permCity: values.permCity,
  permState: values.permState,
  permPin: values.permPin,
  permCountry: values.permCountry,
});

/** The API rejects any property it did not ask for, so an edit sends the
 *  changed fields alone rather than the record it started from. */
export function toEmployeeUpdatePayload(
  values: EmployeeFormValues,
  initial: EmployeeFormValues
): EmployeeUpdatePayload {
  const next = toEmployeeCreatePayload(values);
  const previous = toEmployeeCreatePayload(initial);
  const patch: Record<string, unknown> = {};

  (Object.keys(next) as (keyof EmployeeCreatePayload)[]).forEach(key => {
    if (key === 'email') return;
    // Blanking an optional field has no representation on this API, so an
    // emptied alternate number is left as it was rather than sent as "".
    if (next[key] === undefined || next[key] === previous[key]) return;
    patch[key] = next[key];
  });

  return patch as EmployeeUpdatePayload;
}
