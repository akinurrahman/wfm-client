import { createLookup } from '@/lib/lookup';

/** Every category shares one variant on purpose. In this theme saturated
 *  colour means status, and a designation category is a label, not a state. */
export const designationCategoryLookup = createLookup(
  {
    HR: { label: 'HR', badgeVariant: 'secondary' },
    SUPERVISOR: { label: 'Supervisor', badgeVariant: 'secondary' },
    TECHNICIAN: { label: 'Technician', badgeVariant: 'secondary' },
    ADMIN: { label: 'Admin', badgeVariant: 'secondary' },
    GENERAL: { label: 'General', badgeVariant: 'secondary' },
    ENGINEER: { label: 'Engineer', badgeVariant: 'secondary' },
  },
  'DesignationCategory'
);

export type DesignationCategory = (typeof designationCategoryLookup.values)[number];
