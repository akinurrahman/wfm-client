import type { DesignationCategory } from './designation.lookup';

export type { DesignationCategory };

export type Designation = {
  id: string;
  title: string;
  category: DesignationCategory;
};

/** What the endpoint itself narrows on. `/designations` takes `category` and
 *  nothing else, so this is deliberately smaller than the filter bar. */
export type DesignationListParams = {
  category?: DesignationCategory;
};

/** The endpoint has no `search`, and the whole set arrives in one unpaginated
 *  response, so the search box filters what is already in hand. Keeping it out
 *  of the query key is what stops every keystroke firing a request. */
export type DesignationFilters = DesignationListParams & {
  search?: string;
};
