import type { LeaveType } from './leave-type.types';
import type { PlannedAbsenceStatus } from './planned-absence.lookup';

export type { PlannedAbsenceStatus };

/** The employee slice inlined on an absence. `employeeId` is the badge code,
 *  `id` is the UUID every route takes. */
export type PlannedAbsenceEmployee = {
  id: string;
  employeeId: string;
  fullName: string;
};

export type PlannedAbsence = {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  /** Both bounds inclusive: the 5th to the 7th is three days. */
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  reason: string;
  status: PlannedAbsenceStatus;
  approvedById: string | null;
  approvedAt: string | null;
  rejectedById: string | null;
  rejectedAt: string | null;
  rejectReason: string | null;
  cancelledAt: string | null;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  /** Optional because only the write endpoints promise them. A row renders
   *  from what it was given rather than assuming the include. */
  leaveType?: LeaveType;
  employee?: PlannedAbsenceEmployee;
};

/** `from`/`to` match by overlap, not containment, so an absence running the
 *  28th to the 3rd answers a query for either month. */
export type PlannedAbsenceFilters = {
  page: number;
  limit: number;
  employeeId?: string;
  from?: string;
  to?: string;
  status?: PlannedAbsenceStatus;
};

export type PlannedAbsencePayload = {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  /** Only valid on a single-day absence, and rejected on a range. */
  isHalfDay?: boolean;
  reason: string;
};

/** Filing leave rewrites the past on purpose. `converted` days were already
 *  closed as ABSENT and flipped to ON_LEAVE; `conflicted` days were refused
 *  because a punch or a manual mark contradicts the leave, and the API will not
 *  guess which of the two is true. */
export type PlannedAbsenceResult = {
  absence: PlannedAbsence;
  converted: number;
  conflicted: number;
};

export type PlannedAbsenceCancelPayload = {
  cancelReason: string;
};

/** A rejection is filed against the request, so the employee reads why rather
 *  than finding the row simply gone. */
export type PlannedAbsenceRejectPayload = {
  rejectReason: string;
};

/** `reverted` days went back to ABSENT, or to PRESENT where the punches say the
 *  person worked - those were never deleted. */
export type PlannedAbsenceCancelResult = {
  absence: PlannedAbsence;
  reverted: number;
  conflicted: number;
};
