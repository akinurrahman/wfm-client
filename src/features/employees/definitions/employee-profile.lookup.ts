import { createLookup } from '@/lib/lookup';

export const maritalStatusLookup = createLookup(
  {
    SINGLE: { label: 'Single', badgeVariant: 'secondary' },
    MARRIED: { label: 'Married', badgeVariant: 'secondary' },
    DIVORCED: { label: 'Divorced', badgeVariant: 'secondary' },
    WIDOWED: { label: 'Widowed', badgeVariant: 'secondary' },
  },
  'MaritalStatus'
);

export type MaritalStatus = (typeof maritalStatusLookup.values)[number];

export const emergencyContactRelationLookup = createLookup(
  {
    FATHER: { label: 'Father', badgeVariant: 'secondary' },
    MOTHER: { label: 'Mother', badgeVariant: 'secondary' },
    BROTHER: { label: 'Brother', badgeVariant: 'secondary' },
    SISTER: { label: 'Sister', badgeVariant: 'secondary' },
    UNCLE: { label: 'Uncle', badgeVariant: 'secondary' },
    AUNT: { label: 'Aunt', badgeVariant: 'secondary' },
    SPOUSE: { label: 'Spouse', badgeVariant: 'secondary' },
    FRIEND: { label: 'Friend', badgeVariant: 'secondary' },
    COUSIN: { label: 'Cousin', badgeVariant: 'secondary' },
  },
  'EmergencyContactRelation'
);

export type EmergencyContactRelation = (typeof emergencyContactRelationLookup.values)[number];

export const salaryPeriodLookup = createLookup(
  {
    DAILY: { label: 'Per day', badgeVariant: 'secondary' },
    MONTHLY: { label: 'Per month', badgeVariant: 'secondary' },
    ANNUALLY: { label: 'Per year', badgeVariant: 'secondary' },
  },
  'SalaryPeriod'
);

export type SalaryPeriod = (typeof salaryPeriodLookup.values)[number];
