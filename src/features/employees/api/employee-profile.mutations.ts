import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  BankDetailsPayload,
  CertificateUpsert,
  EducationUpsert,
  EmploymentHistoryUpsert,
  FamilyInfoPayload,
  GovtIdsPayload,
} from '../definitions/employee-profile.schema';
import type { CollectionPayload } from '../definitions/employee-profile.types';
import { EMPLOYEE_KEYS } from '../definitions/employee.constants';
import { employeeProfileApi } from './employee-profile.api';

/** Every sub-resource write lands back in the same place: the employee detail
 *  record the whole profile page reads. */
function useProfileSection<TPayload>(
  employeeId: string,
  save: (employeeId: string, payload: TPayload) => Promise<unknown>,
  successMessage: string
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: TPayload) => save(employeeId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: EMPLOYEE_KEYS.detail(employeeId) });
      toast.success(successMessage);
    },
  });
}

export const useSaveFamilyInfo = (employeeId: string) =>
  useProfileSection<FamilyInfoPayload>(
    employeeId,
    employeeProfileApi.saveFamilyInfo,
    'Family details saved'
  );

export const useSaveGovtIds = (employeeId: string) =>
  useProfileSection<GovtIdsPayload>(
    employeeId,
    employeeProfileApi.saveGovtIds,
    'Government IDs saved'
  );

export const useSaveBankDetails = (employeeId: string) =>
  useProfileSection<BankDetailsPayload>(
    employeeId,
    employeeProfileApi.saveBankDetails,
    'Bank details saved'
  );

export const useSaveEducations = (employeeId: string) =>
  useProfileSection<CollectionPayload<EducationUpsert>>(
    employeeId,
    employeeProfileApi.saveEducations,
    'Education saved'
  );

export const useSaveCertificates = (employeeId: string) =>
  useProfileSection<CollectionPayload<CertificateUpsert>>(
    employeeId,
    employeeProfileApi.saveCertificates,
    'Certificates saved'
  );

export const useSaveEmploymentHistories = (employeeId: string) =>
  useProfileSection<CollectionPayload<EmploymentHistoryUpsert>>(
    employeeId,
    employeeProfileApi.saveEmploymentHistories,
    'Employment history saved'
  );
