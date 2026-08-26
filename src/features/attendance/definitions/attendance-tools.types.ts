import type { SkipReason } from './attendance-tools.lookup';

export type { SkipReason };

export type DerivationSkip = {
  employeeId: string;
  attendanceDate: string;
  reason: SkipReason;
};

export type DerivationSummary = {
  derived: number;
  rowsCreated: number;
  rowsUpdated: number;
  conflicts: number;
  skipped: DerivationSkip[];
};

export type DerivePayload = {
  from: string;
  to: string;
  /** The badge code, not the UUID. Omitted means everyone. */
  employeeCode?: string;
  /** Re-derives days already processed, for when the answer changed rather
   *  than the input. */
  force?: boolean;
};

export type CloseSummary = {
  date: string;
  employeesConsidered: number;
  /** A derive pass runs first, and its own summary comes back nested. */
  derivation: DerivationSummary;
  created: { absent: number; onLeave: number; notApplicable: number };
  conflictsFlagged: number;
  missingCheckoutFixed: number;
  untouched: number;
  skipped: DerivationSkip[];
};
