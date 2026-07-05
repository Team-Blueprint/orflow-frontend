import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { AnalyticsResponse, RevenueDataPoint } from "@/api/types/analytics"

const IS_MOCK_MODE = true

function seedRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function generateMockData(days: number): AnalyticsResponse {
  const rng = seedRandom(42)
  const now = new Date()
  const chart: RevenueDataPoint[] = []

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const revenue = Math.round(800_000 + rng() * 1_700_000)
    const volume = Math.round(30 + rng() * 60)
    chart.push({ date: dateStr, revenue, volume })
  }

  const totalVolume = chart.reduce((s, p) => s + p.revenue, 0)
  const activeSubscribers = Math.round(800 + rng() * 800)
  const totalCustomers = Math.round(2_000 + rng() * 2_000)

  return {
    summary: {
      total_volume: totalVolume,
      active_subscribers: activeSubscribers,
      total_customers: totalCustomers,
      currency: "NGN",
    },
    revenue_chart: chart,
  }
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
        return generateMockData(days)
      }
      const response = await apiClient.get<AnalyticsResponse>(
        ENDPOINTS.ANALYTICS.GET(projectId),
        { params: { days } },
      )
      return response.data
    },
  })
}
