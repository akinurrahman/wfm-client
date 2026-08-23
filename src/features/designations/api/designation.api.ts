import { apiCall } from '@/lib/api/api-call';
import type { ApiAck, ApiResponse } from '@/lib/api/types';

import type { DesignationFormValues } from '../definitions/designation.schema';
import type { Designation, DesignationListParams } from '../definitions/designation.types';

// The HRMS API mounts every route at the host root with no global prefix, so
// this whole feature rides the root instance.
export const designationApi = {
  getList: (params: DesignationListParams, signal?: AbortSignal) =>
    apiCall<ApiResponse<Designation[]>>('/designations', {
      params,
      signal,
      version: 'root',
    }),

  create: (payload: DesignationFormValues) =>
    apiCall<ApiResponse<Designation>>('/designations', {
      method: 'POST',
      body: payload,
      version: 'root',
    }),

  update: (id: string, payload: DesignationFormValues) =>
    apiCall<ApiResponse<Designation>>(`/designations/${id}`, {
      method: 'PATCH',
      body: payload,
      version: 'root',
    }),

  remove: (id: string) =>
    apiCall<ApiAck>(`/designations/${id}`, { method: 'DELETE', version: 'root' }),
};
