import { apiCall } from '@/lib/api/api-call';
import type { ApiResponse } from '@/lib/api/types';

import type {
  BankDetailsPayload,
  CertificateUpsert,
  EducationUpsert,
  EmploymentHistoryUpsert,
  FamilyInfoPayload,
  GovtIdsPayload,
} from '../definitions/employee-profile.schema';
import type {
  BankDetails,
  Certificate,
  CollectionPayload,
  EducationRecord,
  EmploymentHistory,
  FamilyInfo,
  GovtIds,
} from '../definitions/employee-profile.types';

/** Every sub-resource is write-only: there are no GET routes, so the reads all
 *  come from `GET /employees/:id`. */
export const employeeProfileApi = {
  saveFamilyInfo: (employeeId: string, payload: FamilyInfoPayload) =>
    apiCall<ApiResponse<FamilyInfo>>(`/employees/${employeeId}/family-info`, {
      method: 'PUT',
      body: payload,
      version: 'root',
    }),

  saveGovtIds: (employeeId: string, payload: GovtIdsPayload) =>
    apiCall<ApiResponse<GovtIds>>(`/employees/${employeeId}/govt-ids`, {
      method: 'PUT',
      body: payload,
      version: 'root',
    }),

  saveBankDetails: (employeeId: string, payload: BankDetailsPayload) =>
    apiCall<ApiResponse<BankDetails>>(`/employees/${employeeId}/bank-details`, {
      method: 'PUT',
      body: payload,
      version: 'root',
    }),

  saveEducations: (employeeId: string, payload: CollectionPayload<EducationUpsert>) =>
    apiCall<ApiResponse<EducationRecord[]>>(`/employees/${employeeId}/educations`, {
      method: 'PUT',
      body: payload,
      version: 'root',
    }),

  saveCertificates: (employeeId: string, payload: CollectionPayload<CertificateUpsert>) =>
    apiCall<ApiResponse<Certificate[]>>(`/employees/${employeeId}/certificates`, {
      method: 'PUT',
      body: payload,
      version: 'root',
    }),

  saveEmploymentHistories: (
    employeeId: string,
    payload: CollectionPayload<EmploymentHistoryUpsert>
  ) =>
    apiCall<ApiResponse<EmploymentHistory[]>>(`/employees/${employeeId}/employment-histories`, {
      method: 'PUT',
      body: payload,
      version: 'root',
    }),
};
