export type LeaveType = {
  id: string;
  code: string;
  name: string;
  isPaid: boolean;
  isEncashable: boolean;
  /** Null means the balance never lapses. */
  expiryDays: number | null;
  maxPerYear: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/** The catalogue carries its own count wrapper inside the envelope, so the
 *  array sits one level deeper than every other list on this API. */
export type LeaveTypeCatalogue = {
  count: number;
  data: LeaveType[];
};
