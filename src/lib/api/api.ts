import axios from "axios";
import { useAuthStore } from "@/stores/auth.store";

function createApiInstance(baseURL: string) {
  const instance = axios.create({ baseURL });

  instance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    (error) => {
      if (!axios.isAxiosError(error)) {
        return Promise.reject(new Error("Network error", { cause: error }));
      }
      if (error.response?.status === 401) {
        useAuthStore.getState().logout();
        if (typeof window !== "undefined") window.location.href = "/login";
      }
      const apiMessage = error.response?.data?.message;
      if (typeof apiMessage === "string") {
        (error as { normalizedMessage?: string }).normalizedMessage =
          apiMessage;
      }
      return Promise.reject(error);
    },
  );

  return instance;
}

export const api = {
  legacy: createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/api`),
  v1: createApiInstance(`${import.meta.env.VITE_API_BASE_URL}/api/v1`),
  // v2: createApiInstance(import.meta.env.VITE_API_V2_BASE_URL),
};
