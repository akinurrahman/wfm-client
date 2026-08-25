import type {
  EmergencyContactRelation,
  MaritalStatus,
  SalaryPeriod,
} from './employee-profile.lookup';

export type { EmergencyContactRelation, MaritalStatus, SalaryPeriod };

export type FamilyInfo = {
  id: string;
  fathersName: string;
  mothersName: string;
  maritalStatus: MaritalStatus;
  spouseName: string | null;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelation: EmergencyContactRelation;
  emergencyContactAddress: string;
};

export type GovtIds = {
  id: string;
  aadharNo: string;
  panNo: string;
  uanNo: string | null;
  esicNo: string | null;
};

export type BankDetails = {
  id: string;
  accountNo: string;
  ifscCode: string;
  bankName: string;
  branchName: string;
  accountHolder: string;
};

export type EducationRecord = {
  id: string;
  instituteName: string;
  courseName: string;
  startDate: string;
  endDate: string | null;
  isCurrentlyStudying: boolean;
  passingYear: number | null;
  divisionGrade: string | null;
  marksObtained: string | null;
  remarks: string | null;
};

export type Certificate = {
  id: string;
  certificateName: string;
  issuingOrg: string;
  topicDescription: string | null;
  certificateUrl: string | null;
  issueDate: string | null;
  expiryDate: string | null;
};

export type EmploymentHistory = {
  id: string;
  orgName: string;
  designation: string;
  startDate: string;
  endDate: string | null;
  isCurrentlyWorking: boolean;
  jobResponsibilities: string | null;
  /** A Prisma Decimal, so it crosses the wire as a string. Parse before doing
   *  arithmetic with it. */
  salary: string | null;
  salaryPeriod: SalaryPeriod | null;
};

/** The three collection endpoints take additions, edits and removals in one
 *  call. Both keys are required, so an empty array is sent rather than omitted. */
export type CollectionPayload<TUpsert> = {
  upsert: TUpsert[];
  deleteIds: string[];
};
