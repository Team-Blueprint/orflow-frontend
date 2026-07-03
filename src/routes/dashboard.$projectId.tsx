import { useEffect } from "react"
import { createFileRoute, Outlet, useParams } from "@tanstack/react-router"
import { DashboardLayout } from "@/components/dashboard-layout"
import { setActiveProjectId } from "@/api/apiClient"

export const Route = createFileRoute("/dashboard/$projectId")({
  component: Dashboard,
})

function Dashboard() {
  const { projectId } = useParams({ from: "/dashboard/$projectId" })

  useEffect(() => {
    setActiveProjectId(projectId)
  }, [projectId])

  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  )
}
