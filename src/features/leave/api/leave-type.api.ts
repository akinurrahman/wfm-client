import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse } from '@/lib/api/types';

import type { LeaveTypeCatalogue } from '../definitions/leave-type.types';

export const leaveTypeApi = {
  getCatalogue: (signal?: AbortSignal) =>
    apiCall<ApiResponse<LeaveTypeCatalogue>>('/leave-types', { signal, version: 'root' }),
};
