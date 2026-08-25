import { z } from 'zod';

import {
  emergencyContactRelationLookup,
  maritalStatusLookup,
  salaryPeriodLookup,
} from './employee-profile.lookup';
import type {
  Certificate,
  EducationRecord,
  EmploymentHistory,
} from './employee-profile.types';

const CALENDAR_DATE = /^\d{4}-\d{2}-\d{2}$/;
const PHONE = /^\d{7,15}$/;
const YEAR = /^\d{4}$/;
const AMOUNT = /^\d+(\.\d{1,2})?$/;

const text = (label: string, max = 150) =>
  z
    .string()
    .trim()
    .min(1, `${label} is required`)
    .max(max, `Keep ${label.toLowerCase()} under ${max} characters`);

const optionalText = (max = 500) => z.string().trim().max(max).optional();

const calendarDate = (label: string) => z.string().regex(CALENDAR_DATE, `Pick ${label}`);

const optionalCalendarDate = (label: string) =>
  z.string().regex(CALENDAR_DATE, `Pick ${label}`).or(z.literal('')).optional();

/** Empty strings survive validation so a cleared optional field does not read as
 *  a format error. The payload mappers drop them on the way out. */
const blank = (value: string | undefined) => !value || value.trim() === '';

// ---------- Family info ----------

export const familyInfoSchema = z
  .object({
    fathersName: text("Father's name"),
    mothersName: text("Mother's name"),
    maritalStatus: maritalStatusLookup.toZodEnum('Pick a marital status'),
    spouseName: optionalText(150),
    emergencyContactName: text('Emergency contact name'),
    emergencyContactNumber: z
      .string()
      .trim()
      .regex(PHONE, 'Emergency contact number must be 7 to 15 digits'),
    emergencyContactRelation: emergencyContactRelationLookup.toZodEnum('Pick a relation'),
    emergencyContactAddress: text('Emergency contact address', 255),
  })
  .refine(
    values => values.maritalStatus !== maritalStatusLookup.keys.MARRIED || !blank(values.spouseName),
    { path: ['spouseName'], error: 'Spouse name is required for a married employee' }
  );

export type FamilyInfoFormValues = z.infer<typeof familyInfoSchema>;

export const toFamilyInfoPayload = (values: FamilyInfoFormValues) => ({
  fathersName: values.fathersName,
  mothersName: values.mothersName,
  maritalStatus: values.maritalStatus,
  spouseName:
    values.maritalStatus === maritalStatusLookup.keys.MARRIED ? values.spouseName : undefined,
  emergencyContactName: values.emergencyContactName,
  emergencyContactNumber: values.emergencyContactNumber,
  emergencyContactRelation: values.emergencyContactRelation,
  emergencyContactAddress: values.emergencyContactAddress,
});

export type FamilyInfoPayload = ReturnType<typeof toFamilyInfoPayload>;

// ---------- Government IDs ----------

export const govtIdsSchema = z.object({
  aadharNo: z.string().trim().regex(/^\d{12}$/, 'Aadhaar is 12 digits'),
  panNo: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{5}\d{4}[A-Za-z]$/, 'PAN looks like ABCDE1234F')
    .transform(value => value.toUpperCase()),
  uanNo: z.string().trim().regex(/^\d{12}$/, 'UAN is 12 digits').or(z.literal('')).optional(),
  esicNo: z
    .string()
    .trim()
    .regex(/^\d{10,17}$/, 'ESIC is 10 to 17 digits')
    .or(z.literal(''))
    .optional(),
});

export type GovtIdsFormValues = z.infer<typeof govtIdsSchema>;

export const toGovtIdsPayload = (values: GovtIdsFormValues) => ({
  aadharNo: values.aadharNo,
  panNo: values.panNo,
  uanNo: blank(values.uanNo) ? undefined : values.uanNo,
  esicNo: blank(values.esicNo) ? undefined : values.esicNo,
});

export type GovtIdsPayload = ReturnType<typeof toGovtIdsPayload>;

// ---------- Bank details ----------

export const bankDetailsSchema = z.object({
  accountNo: z.string().trim().regex(/^\d{6,20}$/, 'Account number is 6 to 20 digits'),
  ifscCode: z
    .string()
    .trim()
    .regex(/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/, 'IFSC looks like HDFC0001234')
    .transform(value => value.toUpperCase()),
  bankName: text('Bank name'),
  branchName: text('Branch name'),
  accountHolder: text('Account holder'),
});

export type BankDetailsFormValues = z.infer<typeof bankDetailsSchema>;

export type BankDetailsPayload = BankDetailsFormValues;

// ---------- Education ----------

export const educationSchema = z
  .object({
    instituteName: text('Institute name'),
    courseName: text('Course name'),
    startDate: calendarDate('a start date'),
    endDate: optionalCalendarDate('an end date'),
    isCurrentlyStudying: z.boolean(),
    // Held as text rather than a number field: a cleared number input reads as
    // NaN, which is not a state a year can be in.
    passingYear: z.string().trim().regex(YEAR, 'Enter a four digit year').or(z.literal('')).optional(),
    divisionGrade: optionalText(50),
    marksObtained: optionalText(50),
    remarks: optionalText(),
  })
  .refine(values => values.isCurrentlyStudying || !blank(values.endDate), {
    path: ['endDate'],
    error: 'Add an end date, or mark the course as ongoing',
  })
  .refine(values => blank(values.endDate) || values.endDate! >= values.startDate, {
    path: ['endDate'],
    error: 'The end date cannot be before the start date',
  });

export type EducationFormValues = z.infer<typeof educationSchema>;

export const toEducationUpsert = (values: EducationFormValues, id?: string) => ({
  ...(id ? { id } : {}),
  instituteName: values.instituteName,
  courseName: values.courseName,
  startDate: values.startDate,
  endDate: blank(values.endDate) ? undefined : values.endDate,
  isCurrentlyStudying: values.isCurrentlyStudying,
  passingYear: blank(values.passingYear) ? undefined : Number(values.passingYear),
  divisionGrade: blank(values.divisionGrade) ? undefined : values.divisionGrade,
  marksObtained: blank(values.marksObtained) ? undefined : values.marksObtained,
  remarks: blank(values.remarks) ? undefined : values.remarks,
});

export type EducationUpsert = ReturnType<typeof toEducationUpsert>;

/** The reverse mapping lives beside the forward one so the two cannot drift as
 *  fields are added. */
export const toEducationFormValues = (record: EducationRecord): EducationFormValues => ({
  instituteName: record.instituteName,
  courseName: record.courseName,
  startDate: record.startDate.slice(0, 10),
  endDate: record.endDate ? record.endDate.slice(0, 10) : '',
  isCurrentlyStudying: record.isCurrentlyStudying,
  passingYear: record.passingYear ? String(record.passingYear) : '',
  divisionGrade: record.divisionGrade ?? '',
  marksObtained: record.marksObtained ?? '',
  remarks: record.remarks ?? '',
});

// ---------- Certificates ----------

export const certificateSchema = z
  .object({
    certificateName: text('Certificate name'),
    issuingOrg: text('Issuing organisation'),
    topicDescription: optionalText(),
    certificateUrl: z.url('Enter a valid link').or(z.literal('')).optional(),
    issueDate: optionalCalendarDate('an issue date'),
    expiryDate: optionalCalendarDate('an expiry date'),
  })
  .refine(
    values => blank(values.issueDate) || blank(values.expiryDate) || values.expiryDate! >= values.issueDate!,
    { path: ['expiryDate'], error: 'The expiry date cannot be before the issue date' }
  );

export type CertificateFormValues = z.infer<typeof certificateSchema>;

export const toCertificateUpsert = (values: CertificateFormValues, id?: string) => ({
  ...(id ? { id } : {}),
  certificateName: values.certificateName,
  issuingOrg: values.issuingOrg,
  topicDescription: blank(values.topicDescription) ? undefined : values.topicDescription,
  certificateUrl: blank(values.certificateUrl) ? undefined : values.certificateUrl,
  issueDate: blank(values.issueDate) ? undefined : values.issueDate,
  expiryDate: blank(values.expiryDate) ? undefined : values.expiryDate,
});

export type CertificateUpsert = ReturnType<typeof toCertificateUpsert>;

export const toCertificateFormValues = (record: Certificate): CertificateFormValues => ({
  certificateName: record.certificateName,
  issuingOrg: record.issuingOrg,
  topicDescription: record.topicDescription ?? '',
  certificateUrl: record.certificateUrl ?? '',
  issueDate: record.issueDate ? record.issueDate.slice(0, 10) : '',
  expiryDate: record.expiryDate ? record.expiryDate.slice(0, 10) : '',
});

// ---------- Employment history ----------

export const employmentHistorySchema = z
  .object({
    orgName: text('Organisation name'),
    designation: text('Designation'),
    startDate: calendarDate('a start date'),
    endDate: optionalCalendarDate('an end date'),
    isCurrentlyWorking: z.boolean(),
    jobResponsibilities: optionalText(2000),
    salary: z.string().trim().regex(AMOUNT, 'Enter an amount, digits only').or(z.literal('')).optional(),
    salaryPeriod: salaryPeriodLookup.toZodEnum('Pick a salary period').or(z.literal('')).optional(),
  })
  .refine(values => values.isCurrentlyWorking || !blank(values.endDate), {
    path: ['endDate'],
    error: 'Add an end date, or mark the role as current',
  })
  .refine(values => blank(values.endDate) || values.endDate! >= values.startDate, {
    path: ['endDate'],
    error: 'The end date cannot be before the start date',
  })
  .refine(values => blank(values.salary) || !blank(values.salaryPeriod), {
    path: ['salaryPeriod'],
    error: 'A salary needs the period it was paid over',
  });

export type EmploymentHistoryFormValues = z.infer<typeof employmentHistorySchema>;

export const toEmploymentHistoryUpsert = (values: EmploymentHistoryFormValues, id?: string) => ({
  ...(id ? { id } : {}),
  orgName: values.orgName,
  designation: values.designation,
  startDate: values.startDate,
  endDate: blank(values.endDate) ? undefined : values.endDate,
  isCurrentlyWorking: values.isCurrentlyWorking,
  jobResponsibilities: blank(values.jobResponsibilities) ? undefined : values.jobResponsibilities,
  salary: blank(values.salary) ? undefined : Number(values.salary),
  salaryPeriod: blank(values.salaryPeriod)
    ? undefined
    : (values.salaryPeriod as Exclude<EmploymentHistoryFormValues['salaryPeriod'], '' | undefined>),
});

export type EmploymentHistoryUpsert = ReturnType<typeof toEmploymentHistoryUpsert>;

export const toEmploymentHistoryFormValues = (
  record: EmploymentHistory
): EmploymentHistoryFormValues => ({
  orgName: record.orgName,
  designation: record.designation,
  startDate: record.startDate.slice(0, 10),
  endDate: record.endDate ? record.endDate.slice(0, 10) : '',
  isCurrentlyWorking: record.isCurrentlyWorking,
  jobResponsibilities: record.jobResponsibilities ?? '',
  salary: record.salary ?? '',
  salaryPeriod: record.salaryPeriod ?? '',
});
