import { createFileRoute } from "@tanstack/react-router"
import { NotFound } from "@/components/ui/not-found"

export const Route = createFileRoute("/$")({
  component: NotFoundRoute,
})

function NotFoundRoute() {
  return <NotFound />
}
