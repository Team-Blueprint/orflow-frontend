import { createFileRoute } from "@tanstack/react-router"
import { PlanDetailPage } from "@/components/plans/plan-detail-page"

export const Route = createFileRoute("/dashboard/$projectId/plans/$planId")({
  component: PlanDetailPage,
})