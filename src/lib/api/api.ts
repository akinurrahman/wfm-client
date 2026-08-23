import axios, { type InternalAxiosRequestConfig } from "axios";
import { useAuthStore } from "@/stores/auth.store";
import type { ApiResponse, Tokens } from "./types";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** Never refresh-and-retry these. Login and refresh are public, and logout
 *  carries the very refresh token a rotation would have just revoked. */
const NO_RETRY_PATHS = ["/auth/login", "/auth/refresh", "/auth/logout"];

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean };

/** Refresh rotates and revokes, so two requests that 401 at the same time must
 *  share one call. A second refresh would replay a dead token and kill the
 *  session that the first one just repaired. */
let refreshInFlight: Promise<Tokens> | null = null;

function refreshTokens(): Promise<Tokens> {
  if (refreshInFlight) return refreshInFlight;

  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) return Promise.reject(new Error("No refresh token"));

  refreshInFlight = axios
    .post<ApiResponse<Tokens>>(`${BASE_URL}/auth/refresh`, { refreshToken })
    .then((res) => {
      const tokens = res.data.data;
      useAuthStore
        .getState()
        .updateTokens(tokens.accessToken, tokens.refreshToken);
      return tokens;
    })
    .finally(() => {
      refreshInFlight = null;
    });

  return refreshInFlight;
}

function endSession() {
  useAuthStore.getState().logout();
  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
}

function isNoRetryPath(url: string | undefined) {
  return NO_RETRY_PATHS.some((path) => url?.startsWith(path));
}

function createApiInstance(baseURL: string) {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(new Error("Network error", { cause: error }));
      }

      const config = error.config as RetriableConfig | undefined;
      const status = error.response?.status;
      const isAuthEndpoint = isNoRetryPath(config?.url);

      if (status === 401 && config && !config._retried && !isAuthEndpoint) {
        config._retried = true;
        try {
          const { accessToken } = await refreshTokens();
          config.headers.Authorization = `Bearer ${accessToken}`;
          return await instance.request(config);
        } catch {
          endSession();
          return Promise.reject(error);
        }
      }

      // A 401 from /auth/login is bad credentials, not a dead session.
      if (status === 401 && !isAuthEndpoint) endSession();

      const apiMessage = error.response?.data?.message;
      if (typeof apiMessage === "string") {
        (error as { normalizedMessage?: string }).normalizedMessage =
          apiMessage;
      } else if (Array.isArray(apiMessage)) {
        (error as { normalizedMessage?: string }).normalizedMessage =
          apiMessage.join(", ");
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export const api = {
  legacy: createApiInstance(`${BASE_URL}/api`),
  v1: createApiInstance(`${BASE_URL}/api/v1`),
  // The auth service is mounted at the host root, with no global prefix.
  root: createApiInstance(BASE_URL),
};
