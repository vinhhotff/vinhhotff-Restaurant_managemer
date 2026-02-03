import axios, { AxiosError } from "axios";
import type { ApiResponse } from "./types/api";

const baseURL =
  typeof window !== "undefined"
    ? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080"
    : process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => api(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    return api
      .post<ApiResponse<unknown>>("/auth/refresh")
      .then(() => {
        processQueue(null);
        return api(originalRequest);
      })
      .catch((refreshError) => {
        processQueue(refreshError);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:logout"));
        }
        return Promise.reject(refreshError);
      })
      .finally(() => {
        isRefreshing = false;
      });
  }
);

export default api;
export { baseURL };
