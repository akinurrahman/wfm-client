import { z } from 'zod';

import { DESIGNATION_TITLE_MAX } from './designation.constants';
import { designationCategoryLookup } from './designation.lookup';

export const designationFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .max(DESIGNATION_TITLE_MAX, `Keep the title under ${DESIGNATION_TITLE_MAX} characters`),
  category: designationCategoryLookup.toZodEnum('Pick a category'),
});

export type DesignationFormValues = z.infer<typeof designationFormSchema>;
