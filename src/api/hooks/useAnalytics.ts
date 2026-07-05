import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { AnalyticsResponse } from "@/api/types/analytics"

const IS_MOCK_MODE = true

const MOCK_DATA: AnalyticsResponse = {
  summary: {
    total_volume: 45_000_000,
    active_subscribers: 1_240,
    total_customers: 3_150,
    currency: "NGN",
  },
  revenue_chart: [
    { date: "2026-04-01", revenue: 1_200_000, volume: 45 },
    { date: "2026-04-02", revenue: 1_850_000, volume: 62 },
    { date: "2026-04-03", revenue: 1_400_000, volume: 51 },
    { date: "2026-04-04", revenue: 2_100_000, volume: 78 },
    { date: "2026-04-05", revenue: 1_750_000, volume: 55 },
    { date: "2026-04-06", revenue: 2_400_000, volume: 83 },
    { date: "2026-04-07", revenue: 1_950_000, volume: 67 },
  ],
}

export const ZEROED_ANALYTICS: AnalyticsResponse = {
  summary: {
    total_volume: 0,
    active_subscribers: 0,
    total_customers: 0,
    currency: "NGN",
  },
  revenue_chart: [],
}

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms))
}

export function useAnalytics(projectId: string, days = 30) {
  return useQuery({
    queryKey: ["analytics", projectId, days],
    queryFn: async () => {
      if (IS_MOCK_MODE) {
        await delay()
        return MOCK_DATA
      }
      const response = await apiClient.get<AnalyticsResponse>(
        ENDPOINTS.ANALYTICS.GET(projectId),
        { params: { days } },
      )
      return response.data
    },
  })
}
