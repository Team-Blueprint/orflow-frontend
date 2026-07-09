import { useState } from "react"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import { PlansTable, NewPlanModal } from "@/components/plans"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { PlansTableSkeleton } from "@/components/skeletons/plans-table-skeleton"
import { Refresh } from "@/lib/icons"

export const Route = createFileRoute("/dashboard/$projectId/plans/")({
  component: PlansPage,
})

function PlansPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const { projectId } = useParams({ from: "/dashboard/$projectId/plans/" })

  const { data: plans = [], isLoading, refetch } = useQuery({
    queryKey: ["plans", projectId],
    queryFn: () =>
      apiClient.get(ENDPOINTS.PLANS.LIST).then((res) => res.data),
  })

  useDocumentTitle("Plans | Orflow")

  return (
    <div className="p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Plans</h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
            Define pricing tiers for your workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => refetch()}
            className="border border-hairline bg-canvas px-3 py-2.5 text-ink-soft hover:text-ink hover:bg-midnight-soft transition-colors cursor-pointer"
            aria-label="Refresh"
          >
            <Refresh className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="btn-primary text-sm font-bold px-5 py-2.5 cursor-pointer"
          >
            New plan
          </button>
        </div>
      </div>

      {isLoading ? (
        <PlansTableSkeleton />
      ) : (
        <div>
          <PlansTable plans={plans} projectId={projectId} />
        </div>
      )}

      <NewPlanModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  )
}
