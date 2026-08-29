import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse, Paginated } from '@/lib/api/types';

import type {
  EmployeeCreatePayload,
  EmployeeDetail,
  EmployeeFilters,
  EmployeeListItem,
  EmployeeUpdatePayload,
} from '../definitions/employee.types';

export const employeeApi = {
  getList: (filters: EmployeeFilters, signal?: AbortSignal) =>
    apiCall<Paginated<EmployeeListItem>>('/employees', {
      params: filters,
      signal,
    }),

  getMe: (signal?: AbortSignal) =>
    apiCall<ApiResponse<EmployeeDetail>>('/employees/me', { signal }),

  getById: (id: string, signal?: AbortSignal) =>
    apiCall<ApiResponse<EmployeeDetail>>(`/employees/${id}`, { signal, version: 'root' }),

  create: (payload: EmployeeCreatePayload) =>
    apiCall<ApiResponse<EmployeeDetail>>('/employees', {
      method: 'POST',
      body: payload,
    }),

  update: (id: string, payload: EmployeeUpdatePayload) =>
    apiCall<ApiResponse<EmployeeDetail>>(`/employees/${id}`, {
      method: 'PATCH',
      body: payload,
    }),

  /** Hard-deletes the employee and their login. Off-boarding a leaver is the
   *  exit flow instead, which keeps the history. */
  remove: (id: string) =>
    apiCall<ApiResponse<{ id: string }>>(`/employees/${id}`, {
      method: 'DELETE',
    }),
};
