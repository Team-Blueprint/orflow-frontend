export interface AnalyticsSummary {
  total_volume: number
  active_subscribers: number
  total_customers: number
  currency: string
}

export interface RevenueDataPoint {
  date: string
  revenue: number
  volume: number
}

export interface AnalyticsResponse {
  summary: AnalyticsSummary
  revenue_chart: RevenueDataPoint[]
}
