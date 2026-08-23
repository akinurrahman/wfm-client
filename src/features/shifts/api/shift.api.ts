import { apiCall } from '@/lib/api/api-call';
import type { ApiAck, ApiResponse, Paginated } from '@/lib/api/types';

import type { Shift, ShiftFilters, ShiftPayload } from '../definitions/shift.types';

export const shiftApi = {
  getList: (filters: ShiftFilters, signal?: AbortSignal) =>
    apiCall<Paginated<Shift>>('/shifts', { params: filters, signal, version: 'root' }),

  create: (payload: ShiftPayload) =>
    apiCall<ApiResponse<Shift>>('/shifts', { method: 'POST', body: payload, version: 'root' }),

  update: (id: string, payload: ShiftPayload) =>
    apiCall<ApiResponse<Shift>>(`/shifts/${id}`, { method: 'PATCH', body: payload, version: 'root' }),

  remove: (id: string) => apiCall<ApiAck>(`/shifts/${id}`, { method: 'DELETE', version: 'root' }),
};
