import { useState } from "react"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { useAnalytics, ZEROED_ANALYTICS } from "@/api/hooks/useAnalytics"
import { KPICard } from "@/components/kpi-card"
import { RevenueChart } from "@/components/revenue-chart"
import { TimeRangeSelector } from "@/components/time-range-selector"
import { AnalyticsSkeleton } from "@/components/skeletons/analytics-skeleton"
import { formatNaira } from "@/lib/currency"

export const Route = createFileRoute("/dashboard/$projectId/")({
  component: Overview,
})

const LABELS: Record<number, string> = {
  1: "last 24 hours",
  7: "last 7 days",
  30: "last 30 days",
  90: "last 90 days",
}

function Overview() {
  const { projectId } = useParams({ from: "/dashboard/$projectId/" })
  const [days, setDays] = useState(30)
  const { data, isLoading } = useAnalytics(projectId, days)

  const analytics = data ?? ZEROED_ANALYTICS
  const { summary, revenue_chart } = analytics

  return (
    <div className="p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Overview</h1>
        <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
          Analytics and activity for this workspace.
        </p>
      </div>

      {isLoading ? (
        <AnalyticsSkeleton />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <KPICard
              label="Total Volume"
              value={formatNaira(summary.total_volume)}
            />
            <KPICard
              label="Active Subscribers"
              value={summary.active_subscribers.toLocaleString("en-US")}
              variant={summary.active_subscribers > 0 ? "success" : "default"}
            />
            <KPICard
              label="Total Customers"
              value={summary.total_customers.toLocaleString("en-US")}
            />
          </div>

          <div className="mt-3 sm:mt-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs sm:text-sm font-semibold text-ink tracking-tight">
                Revenue ({LABELS[days] ?? `${days} days`})
              </p>
              <TimeRangeSelector value={days} onChange={setDays} />
            </div>
            <RevenueChart data={revenue_chart} />
          </div>
        </>
      )}
    </div>
  )
}
