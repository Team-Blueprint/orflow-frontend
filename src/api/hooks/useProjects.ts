import { useQuery } from "@tanstack/react-query";
import { ENDPOINTS } from "@/api/ENDPOINTS";
import { apiClient } from "@/api/apiClient";

interface Project {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
}

export function useProjects() {
  return useQuery({
    queryKey: ["projects"] as const,
    queryFn: async () => {
      const response = await apiClient.get<Project[]>(ENDPOINTS.PROJECTS.LIST);
      return response.data;
    },
  });
}