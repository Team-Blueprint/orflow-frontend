import axios from "axios";

const LS_API_KEY = "orflow_api_key";
const LS_JWT = "orflow_jwt";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window === "undefined") return config;

  const apiKey = localStorage.getItem(LS_API_KEY);
  const jwt = localStorage.getItem(LS_JWT);

  if (apiKey) config.headers.set("X-API-Key", apiKey);
  if (jwt) config.headers.set("Authorization", `Bearer ${jwt}`);

  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(LS_JWT);
      }
    }
    return Promise.reject(error);
  },
);
