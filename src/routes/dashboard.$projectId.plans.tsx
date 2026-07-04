import { createFileRoute, Outlet } from "@tanstack/react-router"
import { useAuth } from "@/lib/auth"

function PlansLayout() {
  const { isAuthenticated } = useAuth()
  
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas">
        <div className="text-center">
          <h1 className="text-xl font-semibold text-ink">Authentication Required</h1>
          <p className="text-sm text-ink-soft mt-2">Please sign in to access the plans management.</p>
        </div>
      </div>
    )
  }
  
  return <Outlet />
}

export const Route = createFileRoute("/dashboard/$projectId/plans")({
  component: PlansLayout,
})