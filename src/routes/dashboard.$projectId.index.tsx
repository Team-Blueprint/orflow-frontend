import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/$projectId/")({
  component: Overview,
})

function Overview() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold tracking-tight text-ink">Overview</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Analytics and activity for this workspace.
      </p>
    </div>
  )
}
