import type { AsyncFetchFn } from '@/systems/form';

import { employeeApi } from './employee.api';

/** The picker any screen uses to name an employee. It lives with the employee
 *  entity because the search endpoint and the label shape are this feature's to
 *  decide, not the caller's. Leavers are deliberately not filtered out: their
 *  past records still have to be findable. */
export const fetchEmployeeOptions: AsyncFetchFn = async ({ search, page, limit, signal }) => {
  const response = await employeeApi.getList(
    { search: search || undefined, page, limit },
    signal
  );

  return {
    options: response.data.map(employee => ({
      value: employee.id,
      label: `${employee.fullName} (${employee.employeeId})`,
    })),
    hasMore: response.pagination.hasNext,
  };
};
