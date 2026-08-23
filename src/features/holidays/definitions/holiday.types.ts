export type Holiday = {
  id: string;
  /** An array because festivals collide: one row per calendar day, however
   *  many things are being observed on it. */
  names: string[];
  /** A date-only column, so it arrives as midnight UTC and only the date part
   *  is meaningful. */
  date: string;
  isOptional: boolean;
  createdAt: string;
  updatedAt: string;
};

/** GET /holidays does not return a bare array. It wraps the rows in a summary
 *  of the year they belong to, so the payload nests one `data` inside another. */
export type HolidayYear = {
  year: number;
  count: number;
  data: Holiday[];
};

export type HolidayFilters = {
  year: number;
  isOptional?: string;
};

export type HolidayPayload = {
  names: string[];
  date: string;
  isOptional: boolean;
};
