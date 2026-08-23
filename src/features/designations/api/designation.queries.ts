import { useQuery } from '@tanstack/react-query';

import { DESIGNATION_KEYS } from '../definitions/designation.constants';
import type { DesignationListParams } from '../definitions/designation.types';
import { designationApi } from './designation.api';

/** Reference data that feeds both this screen and, later, the employee form's
 *  designation dropdown. A long staleTime is what makes the second reader free. */
export function useDesignationList(params: DesignationListParams = {}) {
  return useQuery({
    queryKey: DESIGNATION_KEYS.list(params),
    queryFn: ({ signal }) => designationApi.getList(params, signal),
    staleTime: 5 * 60_000,
    placeholderData: prev => prev,
  });
}
