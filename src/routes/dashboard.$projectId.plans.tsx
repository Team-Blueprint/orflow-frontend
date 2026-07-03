import { createFileRoute, Outlet } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/$projectId/plans")({
  component: PlansLayout,
})

function PlansLayout() {
  return <Outlet />
}
