import axios from "axios";

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const normalized = (error as { normalizedMessage?: string })
      .normalizedMessage;
    if (normalized) return normalized;

    if (error.code === "ERR_CANCELED") return "Request cancelled";
    if (!error.response) return "Network error. Check your connection.";
    if (error.response.status >= 500) return "Something went wrong on our end.";
  }

  if (error instanceof Error) return error.message;

  return "Something went wrong. Please try again.";
}

/** Lets a screen tell one refusal from another - a 403 on a `me/*` route is a
 *  missing profile to explain, not a failure to retry. */
export function getErrorStatus(error: unknown): number | undefined {
  return axios.isAxiosError(error) ? error.response?.status : undefined;
}

function describeDetail(entry: unknown): string {
  if (typeof entry === "string") return entry;
  if (entry && typeof entry === "object") {
    return Object.entries(entry)
      .map(([key, value]) => `${key}: ${String(value)}`)
      .join(", ");
  }
  return String(entry ?? "");
}

/** The refusal list an envelope can carry beside its message. A refused period
 *  lock is the one place it is populated, and that list is the fix-it worklist,
 *  so it has to reach the screen rather than being flattened into a toast. */
export function getErrorDetails(error: unknown): string[] {
  if (!axios.isAxiosError(error)) return [];

  const details = (error.response?.data as { errors?: unknown } | undefined)?.errors;
  if (!Array.isArray(details)) return [];

  return details.map(describeDetail).filter(Boolean);
}
