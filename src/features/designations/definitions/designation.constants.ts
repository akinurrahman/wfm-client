import { defineUrlFilters } from '@/systems/filters';

import { designationCategoryLookup } from './designation.lookup';
import type { DesignationFilters, DesignationListParams } from './designation.types';

export const DESIGNATION_KEYS = {
  all: ['designations'] as const,
  lists: () => [...DESIGNATION_KEYS.all, 'list'] as const,
  list: (params: DesignationListParams) => [...DESIGNATION_KEYS.lists(), params] as const,
};

export const DESIGNATION_FILTER_SPEC = defineUrlFilters<DesignationFilters>({
  search: {},
  category: { values: designationCategoryLookup.values },
});

export const DESIGNATION_TITLE_MAX = 100;
