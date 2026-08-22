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
