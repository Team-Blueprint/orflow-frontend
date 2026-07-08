import axios from "axios";
import { isTestMode } from "@/lib/environment";
import { getPortalToken } from "@/lib/portal-auth";

declare module "axios" {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

const LS_API_KEY = "orflow_api_key";
export { LS_API_KEY };
const LS_ACTIVE_PROJECT = "orflow_active_project_id";

export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const apiKey = localStorage.getItem(LS_API_KEY);
  if (apiKey) config.headers.set("X-API-Key", apiKey);

  const projectId = localStorage.getItem(LS_ACTIVE_PROJECT);
  if (projectId) config.headers.set("X-Project-Id", projectId);

  if (isTestMode()) config.headers.set("X-Test-Mode", "true");

  const portalToken = getPortalToken();
  if (portalToken) config.headers.setAuthorization(`Bearer ${portalToken}`);

  const csrfToken = getCsrfToken();
  if (
    csrfToken &&
    config.method &&
    !["get", "head", "options"].includes(config.method)
  ) {
    config.headers.set("X-CSRF-Token", csrfToken);
  }

  return config;
});

let isRefreshing = false;
let refreshQueue: (() => void)[] = [];

function flushRefreshQueue() {
  refreshQueue.forEach((cb) => cb());
  refreshQueue = [];
}

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (!axios.isAxiosError(error) || error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (!originalRequest || originalRequest._retry) {
      return Promise.reject(error);
    }

    const url = originalRequest.url ?? "";
    if (url === "/v1/auth/refresh") {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push(() => resolve(apiClient(originalRequest)));
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await apiClient.post("/v1/auth/refresh");
      isRefreshing = false;
      flushRefreshQueue();
      return apiClient(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      refreshQueue = [];
      if (axios.isAxiosError(refreshError) && refreshError.response?.status === 401) {
        const publicPaths = ["/sign-in", "/sign-up", "/"];
        const publicPrefixes = ["/subscribe", "/portal", "/auth/google/callback"];
        const isPublic =
          publicPaths.includes(window.location.pathname) ||
          publicPrefixes.some(
            (p) =>
              window.location.pathname === p ||
              window.location.pathname.startsWith(p + "/"),
          );
        if (typeof window !== "undefined" && !isPublic) {
          window.location.href = "/sign-in";
        }
      }
      return Promise.reject(error);
    }
  },
);

function getCsrfToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(/(?:^|;\s*)csrf_token=([^;]*)/);
  return match ? match[1] : null;
}

export function extractCsrfToken(): string | null {
  return getCsrfToken();
}

export function setActiveProjectId(id: string | null) {
  if (id) {
    localStorage.setItem(LS_ACTIVE_PROJECT, id);
  } else {
    localStorage.removeItem(LS_ACTIVE_PROJECT);
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("orflow-project-changed"))
  }
}

export function getActiveProjectId(): string | null {
  return localStorage.getItem(LS_ACTIVE_PROJECT);
}


