export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type ApiResponse<T> = {
  status: "success" | "error";
  message: string;
  data: T;
};

export type Paginated<T> = ApiResponse<T[]> & {
  pagination: Pagination;
};

/** An object (not a list) payload that still carries a pagination block, e.g. a
 *  ledger response whose `entries` are paged but whose totals are not. */
export type PaginatedObject<T> = ApiResponse<T> & {
  pagination: Pagination;
};
