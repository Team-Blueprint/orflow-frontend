import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { AnalyticsResponse } from "@/api/types/analytics"

export const ZEROED_ANALYTICS: AnalyticsResponse = {
  summary: {
    total_volume: 0,
    active_subscribers: 0,
    total_customers: 0,
    currency: "NGN",
  },
  revenue_chart: [],
}

export function useAnalytics(projectId: string, days = 30) {
  return useQuery({
    queryKey: ["analytics", projectId, days],
    queryFn: async () => {
      const response = await apiClient.get<AnalyticsResponse>(
        ENDPOINTS.ANALYTICS.GET(projectId),
        { params: { days } },
      )
      return response.data
    },
  })
}
