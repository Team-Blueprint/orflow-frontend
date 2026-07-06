import { useNavigate } from "@tanstack/react-router"
import { setActiveProjectId } from "@/api/apiClient"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string | null
    created_at: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate()
  const created = new Date(project.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div
      onClick={() => {
        setActiveProjectId(project.id)
        navigate({ to: "/dashboard/$projectId", params: { projectId: project.id } })
      }}
      className="flex flex-col border border-hairline bg-zinc-900/50 p-5 hover:border-zinc-700 hover:bg-zinc-900 transition-all cursor-pointer min-h-[140px]"
    >
      <div className="flex items-start gap-3">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f97316"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="shrink-0 mt-0.5"
        >
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
        </svg>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-bold text-ink truncate">{project.name}</h3>
          {project.description && (
            <p className="mt-1 text-xs text-ink-soft line-clamp-2 leading-relaxed">{project.description}</p>
          )}
        </div>
      </div>
      <div className="mt-auto pt-5 flex items-center gap-1.5 text-[10px] font-mono text-zinc-600">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Created {created}
      </div>
    </div>
  )
}
