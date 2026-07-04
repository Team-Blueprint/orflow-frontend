import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/dashboard/$projectId/")({
  component: Overview,
})

function Overview() {
  return (
    <div className="p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Overview</h1>
        <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
          Analytics and activity for this workspace.
        </p>
      </div>
    </div>
  )
}
