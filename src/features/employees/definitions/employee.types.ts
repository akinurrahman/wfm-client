import type { UserRole } from '@/constants/ROLES';
import type { DesignationCategory } from '@/features/designations';

import type {
  BankDetails,
  Certificate,
  EducationRecord,
  EmploymentHistory,
  FamilyInfo,
  GovtIds,
} from './employee-profile.types';
import type { EmployeeType, Gender } from './employee.lookup';

export type { EmployeeType, Gender };

/** The two identifiers are easy to confuse and mean different things: `id` is
 *  the UUID every route takes, `employeeId` is the badge code biometric devices
 *  punch against. */
export type Employee = {
  id: string;
  employeeId: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  alternateNumber: string | null;
  dateOfBirth: string;
  gender: Gender;
  employeeType: EmployeeType;
  designationId: string;
  dateOfJoining: string;
  shiftId: string | null;
  isActive: boolean;
  lastWorkingDay: string | null;
  commAddressLine: string;
  commCity: string;
  commState: string;
  commPin: string;
  commCountry: string;
  permAddressLine: string;
  permCity: string;
  permState: string;
  permPin: string;
  permCountry: string;
  createdAt: string;
  updatedAt: string;
  designation: { id: string; title: string; category: DesignationCategory };
};

export type EmployeeListItem = Employee & {
  user: { id: string; email: string; role: UserRole };
};

/** The whole profile arrives inlined here. There are no per-tab GET routes, so
 *  every profile tab reads this one record. */
export type EmployeeDetail = Employee & {
  email: string;
  role: UserRole;
  familyInfo: FamilyInfo | null;
  govtIds: GovtIds | null;
  bankDetails: BankDetails | null;
  educationRecords: EducationRecord[];
  certificates: Certificate[];
  employmentHistories: EmploymentHistory[];
};

export type EmployeeFilters = {
  search?: string;
  designationId?: string;
  employeeType?: EmployeeType;
  gender?: Gender;
  /** The API reads this as the strings "true"/"false", which is what a query
   *  string carries anyway. */
  isActive?: string;
  page: number;
  limit: number;
};

export type EmployeeCreatePayload = {
  email: string;
  fullName: string;
  phoneNumber: string;
  alternateNumber?: string;
  dateOfBirth: string;
  gender: Gender;
  employeeType: EmployeeType;
  designationId: string;
  dateOfJoining: string;
  shiftId?: string;
  commAddressLine: string;
  commCity: string;
  commState: string;
  commPin: string;
  commCountry: string;
  permAddressLine: string;
  permCity: string;
  permState: string;
  permPin: string;
  permCountry: string;
};

/** Email is immutable on PATCH, and the API rejects any property it did not
 *  ask for, so an update carries only what changed. */
export type EmployeeUpdatePayload = Partial<Omit<EmployeeCreatePayload, 'email'>>;
