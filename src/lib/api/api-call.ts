import type { AxiosRequestConfig } from "axios";
import { api } from "./api";

export type ApiVersion = keyof typeof api;

export type ApiCallOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  params?: Record<string, unknown>;
  signal?: AbortSignal;
  version?: ApiVersion;
  responseType?: AxiosRequestConfig["responseType"];
  contentType?: string;
  headers?: Record<string, string>;
};

export async function apiCall<T>(
  endpoint: string,
  options: ApiCallOptions = {},
): Promise<T> {
  const {
    method = "GET",
    body,
    params,
    signal,
    version = "legacy",
    responseType = "json",
    contentType = "application/json",
    headers = {},
  } = options;

  const isFormData = body instanceof FormData;

  const res = await api[version].request<T>({
    url: endpoint,
    method,
    data: body,
    params,
    signal,
    responseType,
    headers: isFormData ? headers : { "Content-Type": contentType, ...headers },
  });

  return res.data;
}
