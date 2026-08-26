import type {
  AttendanceSource,
  AttendanceStatus,
  CompensationType,
  DayType,
  MarkStatus,
  RosterStatus,
} from './attendance.lookup';

export type {
  AttendanceSource,
  AttendanceStatus,
  CompensationType,
  DayType,
  MarkStatus,
  RosterStatus,
};

/** One decided employee-day. The row existing is itself the statement that the
 *  day has been decided; nothing pre-creates blanks. */
export type Attendance = {
  id: string;
  employeeId: string;
  attendanceDate: string;
  /** The shift the day was judged against, denormalised at decision time. */
  shiftId: string | null;
  dayType: DayType;
  status: AttendanceStatus;
  source: AttendanceSource;
  /** Instants, not wall-clock times. */
  checkIn: string | null;
  checkOut: string | null;
  workedMinutes: number | null;
  lateMinutes: number | null;
  earlyExitMinutes: number | null;
  overtimeMinutes: number | null;
  hasConflict: boolean;
  conflictNote: string | null;
  compensationType: CompensationType | null;
  remark: string | null;
  markedById: string | null;
  plannedAbsenceId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type RosterEmployee = {
  id: string;
  /** The human badge code, e.g. `WFM-EMP-07`. Devices speak this; the API
   *  everywhere else speaks `id`. */
  employeeId: string;
  fullName: string;
  designation: string;
};

export type RosterShift = {
  id: string;
  code: string;
  name: string;
  startMinutes: number;
  endMinutes: number;
  breakMinutes: number;
  graceMinutes: number;
  weeklyOffDays: number[];
};

export type RosterPlannedAbsence = {
  id: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  isHalfDay: boolean;
  reason: string | null;
  leaveType?: { id: string; code: string; name: string; isPaid: boolean };
};

export type RosterRow = {
  employee: RosterEmployee;
  shift: RosterShift | null;
  attendance: Attendance | null;
  plannedAbsence: RosterPlannedAbsence | null;

  dayType: DayType;
  status: RosterStatus;
  /** True only when an `Attendance` row exists. When false the status shown is
   *  a description of the day, not a stored fact. */
  isMarked: boolean;
  source: AttendanceSource | null;
  hasConflict: boolean;
  /** False for future dates: HR may look, not mark. */
  isEditable: boolean;
  /** True when the employee has no shift, so the day cannot be judged at all. */
  noShiftAssigned: boolean;
};

export type RosterFilters = {
  date: string;
  page: number;
  limit: number;
};

/** One day's decision, in either of the two modes the API accepts. Time mode
 *  runs the arithmetic; status mode skips it and leaves the times null. */
export type AttendanceMarkInput = {
  status?: MarkStatus;
  leaveTypeId?: string;
  /** `HH:mm` on the office clock, never converted to UTC. */
  checkIn?: string;
  checkOut?: string;
  compensationType?: CompensationType;
  /** Always required. This write is what sets `source` to MANUAL. */
  remark: string;
};

export type AttendanceBulkEntry = AttendanceMarkInput & { employeeId: string };

export type AttendanceBulkPayload = {
  date: string;
  entries: AttendanceBulkEntry[];
};

export type AttendanceBulkResult = {
  date: string;
  created: number;
  updated: number;
  attendance: Attendance[];
};

/** The audited slice of an attendance row. `before: {}` means the row did not
 *  exist, so the entry is a creation rather than an edit. */
export type AttendanceAuditSnapshot = Partial<
  Pick<
    Attendance,
    | 'dayType'
    | 'status'
    | 'source'
    | 'checkIn'
    | 'checkOut'
    | 'workedMinutes'
    | 'lateMinutes'
    | 'earlyExitMinutes'
    | 'overtimeMinutes'
    | 'compensationType'
    | 'hasConflict'
    | 'conflictNote'
    | 'remark'
    | 'shiftId'
    | 'plannedAbsenceId'
  >
>;

export type AttendanceAuditEntry = {
  id: string;
  attendanceId: string;
  /** Null means the nightly close job, which nobody asked for by hand. */
  changedById: string | null;
  before: AttendanceAuditSnapshot;
  after: AttendanceAuditSnapshot;
  remark: string | null;
  changedAt: string;
};

export type AttendanceAuditFilters = {
  page: number;
  limit: number;
};
