export type Shift = {
  id: string;
  name: string;
  code: string;
  /** Minutes from midnight, 0..1439. `endMinutes < startMinutes` is a night
   *  shift, which is the only way the API marks one. */
  startMinutes: number;
  endMinutes: number;
  breakMinutes: number;
  graceMinutes: number;
  /** 0 = Sunday. At most six entries, since a shift cannot be off every day. */
  weeklyOffDays: number[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;

  // Derived server-side and returned on every shift. Reading them beats
  // recomputing here, where a rounding or midnight-wrap difference would show
  // up as the list and the API disagreeing about the same shift.
  /** True when the shift crosses midnight. */
  isNightShift: boolean;
  /** Wall-clock span minus the break. */
  netShiftMinutes: number;
  startTime: string;
  endTime: string;
};

export type ShiftFilters = {
  search?: string;
  isActive?: string;
  page: number;
  limit: number;
};

/** What the wire takes. `isActive` crosses as a string because that is what a
 *  query string carries, and the DTO transforms it server-side. */
export type ShiftPayload = {
  name: string;
  code: string;
  startMinutes: number;
  endMinutes: number;
  breakMinutes: number;
  graceMinutes: number;
  weeklyOffDays: number[];
  isActive: boolean;
};
