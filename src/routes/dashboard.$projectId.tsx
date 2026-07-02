import { createFileRoute } from "@tanstack/react-router"
import { DashboardLayout } from "@/components/dashboard-layout"

export const Route = createFileRoute("/dashboard/$projectId")({
  component: Dashboard,
})

function Dashboard() {
  return (
    <DashboardLayout>
      <div className="mx-auto max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-soft">
          Overview of your subscriptions, revenue, and activity.
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Active Subscribers", value: "2,847" },
            { label: "Monthly Revenue", value: "₦8.4M" },
            { label: "Failed Payments", value: "23" },
          ].map((card) => (
            <div key={card.label} className="border border-hairline bg-paper p-6">
              <span className="text-xs text-ink-soft">{card.label}</span>
              <p className="mt-1 text-2xl font-bold tracking-tight text-ink">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
