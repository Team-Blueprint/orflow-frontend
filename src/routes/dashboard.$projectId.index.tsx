import { createFileRoute, useParams } from "@tanstack/react-router"
import { useAnalytics, ZEROED_ANALYTICS } from "@/api/hooks/useAnalytics"
import { KPICard } from "@/components/kpi-card"
import { RevenueChart } from "@/components/revenue-chart"
import { AnalyticsSkeleton } from "@/components/skeletons/analytics-skeleton"

export const Route = createFileRoute("/dashboard/$projectId/")({
  component: Overview,
})

function Overview() {
  const { projectId } = useParams({ from: "/dashboard/$projectId/" })
  const { data, isLoading } = useAnalytics(projectId)

  const analytics = data ?? ZEROED_ANALYTICS
  const { summary, revenue_chart } = analytics
  const fmt = (n: number) => n.toLocaleString("en-US")

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
              value={`${summary.currency} ${fmt(summary.total_volume)}`}
            />
            <KPICard
              label="Active Subscribers"
              value={fmt(summary.active_subscribers)}
              variant={summary.active_subscribers > 0 ? "success" : "default"}
            />
            <KPICard
              label="Total Customers"
              value={fmt(summary.total_customers)}
            />
          </div>

          <div className="mt-3 sm:mt-4">
            <RevenueChart data={revenue_chart} />
          </div>
        </>
      )}
    </div>
  )
}
