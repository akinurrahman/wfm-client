import { createLookup } from '@/lib/lookup';

export const genderLookup = createLookup(
  {
    MALE: { label: 'Male', badgeVariant: 'secondary' },
    FEMALE: { label: 'Female', badgeVariant: 'secondary' },
    OTHER: { label: 'Other', badgeVariant: 'secondary' },
  },
  'Gender'
);

export type Gender = (typeof genderLookup.values)[number];

export const employeeTypeLookup = createLookup(
  {
    HIGHLY_SKILLED: { label: 'Highly skilled', badgeVariant: 'secondary' },
    SKILLED: { label: 'Skilled', badgeVariant: 'secondary' },
    SEMI_SKILLED: { label: 'Semi skilled', badgeVariant: 'secondary' },
    UNSKILLED: { label: 'Unskilled', badgeVariant: 'secondary' },
  },
  'EmployeeType'
);

export type EmployeeType = (typeof employeeTypeLookup.values)[number];
