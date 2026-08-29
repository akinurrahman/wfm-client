import type { PlannedAbsenceStatus } from './planned-absence.lookup';

/** No `employeeId` anywhere on this surface: every `me/*` route resolves the
 *  employee off the token, and the list has no parameter to widen. */
export type MyLeaveFilters = {
  page: number;
  limit: number;
  from?: string;
  to?: string;
  status?: PlannedAbsenceStatus;
};

export type MyLeaveApplyPayload = {
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  /** Only valid on a single-day request, and rejected on a range. */
  isHalfDay?: boolean;
  reason: string;
};
