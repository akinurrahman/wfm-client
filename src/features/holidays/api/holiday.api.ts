import { apiCall } from '@/lib/api/api-call';
import type { ApiAck, ApiResponse } from '@/lib/api/types';

import type {
  Holiday,
  HolidayFilters,
  HolidayPayload,
  HolidayYear,
} from '../definitions/holiday.types';

export const holidayApi = {
  getList: (filters: HolidayFilters, signal?: AbortSignal) =>
    apiCall<ApiResponse<HolidayYear>>('/holidays', { params: filters, signal, version: 'root' }),

  create: (payload: HolidayPayload) =>
    apiCall<ApiResponse<Holiday>>('/holidays', { method: 'POST', body: payload, version: 'root' }),

  update: (id: string, payload: HolidayPayload) =>
    apiCall<ApiResponse<Holiday>>(`/holidays/${id}`, {
      method: 'PATCH',
      body: payload,
      version: 'root',
    }),

  remove: (id: string) =>
    apiCall<ApiAck>(`/holidays/${id}`, { method: 'DELETE', version: 'root' }),
};
