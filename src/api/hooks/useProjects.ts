import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/api/ENDPOINTS";
import { apiClient } from "@/api/apiClient";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

function delay(ms = 150) {
  return new Promise((r) => setTimeout(r, ms));
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"] as const,
    queryFn: async () => {
      await delay(); // Simulate network delay
      const response = await apiClient.get<Project[]>(ENDPOINTS.PROJECTS.LIST);
      return response.data;
    },
  });
}