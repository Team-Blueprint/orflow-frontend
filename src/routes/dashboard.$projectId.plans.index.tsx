import { useState } from "react"
import { createFileRoute } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import { PlansTable, NewPlanModal } from "@/components/plans"

export const Route = createFileRoute("/dashboard/$projectId/plans/")({
  component: PlansPage,
})

function PlansPage() {
  const [modalOpen, setModalOpen] = useState(false)

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () =>
      apiClient.get(ENDPOINTS.PLANS.LIST).then((res) => res.data),
  })

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">Plans</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Define pricing tiers for your workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary text-sm font-bold px-4 py-2.5 cursor-pointer"
        >
          New plan
        </button>
      </div>

      {isLoading ? (
        <div className="mt-16 flex justify-center">
          <div className="h-5 w-5 animate-spin rounded-full border border-hairline-strong border-t-transparent" />
        </div>
      ) : (
        <PlansTable plans={plans} />
      )}

      <NewPlanModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
