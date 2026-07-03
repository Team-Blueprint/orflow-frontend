import { createFileRoute, Outlet } from "@tanstack/react-router"
import { ProtectedRoute } from "@/components/protected-route"

export const Route = createFileRoute("/dashboard")({
  component: DashboardShell,
})

function DashboardShell() {
  return (
    <ProtectedRoute>
      <Outlet />
    </ProtectedRoute>
  )
}
