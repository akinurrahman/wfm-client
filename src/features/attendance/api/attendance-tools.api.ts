import { apiCall } from "@/lib/api/api-call";
import type { ApiResponse } from "@/lib/api/types";

import type {
  CloseSummary,
  DerivationSummary,
  DerivePayload,
} from "../definitions/attendance-tools.types";

export const attendanceToolsApi = {
  derive: (payload: DerivePayload) =>
    apiCall<ApiResponse<DerivationSummary>>("/attendance/derive", {
      method: "POST",
      body: payload,
    }),

  /** The date is a query param here, not a body, which is the one place this
   *  API breaks its own pattern. */
  close: (date: string) =>
    apiCall<ApiResponse<CloseSummary>>("/attendance/close", {
      method: "POST",
      params: { date },
    }),
};
