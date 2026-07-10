import { useEffect, useState } from "react"
import { createFileRoute, Link } from "@tanstack/react-router"
import { AccountLayout } from "@/components/account-layout"
import { ProjectCard } from "@/components/project-card"
import { ProjectGridSkeleton } from "@/components/skeletons/project-grid-skeleton"
import { apiClient } from "@/api/apiClient"

interface Project {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
})

function DashboardHome() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    apiClient.get<Project[]>("/v1/projects/list")
      .then((res) => setProjects(res.data))
      .catch(() => setError("Failed to load projects"))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AccountLayout breadcrumb="Dashboard">
      <div className="mx-auto max-w-5xl p-4 sm:px-8 sm:pt-4 sm:pb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Projects</h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
              Select a project to manage subscriptions, plans, and webhooks
            </p>
          </div>
          <Link
            to="/dashboard/new"
            className="btn-primary text-sm font-bold px-4 py-2.5 cursor-pointer text-center"
          >
            New project
          </Link>
        </div>

        {loading && <ProjectGridSkeleton />}

        {error && (
          <p className="mt-6 text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">{error}</p>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="mt-24 flex flex-col items-center justify-center">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <p className="mt-5 text-sm text-ink-soft max-w-xs text-center leading-relaxed">
              No projects yet. Click &lsquo;New project&rsquo; above to initialize your first workspace.
            </p>
          </div>
        )}

        {!loading && projects.length > 0 && (
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  )
}
