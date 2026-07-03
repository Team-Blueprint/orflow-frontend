import { Link } from "@tanstack/react-router"

interface ProjectCardProps {
  project: {
    id: string
    name: string
    description: string | null
    created_at: string
  }
}

export function ProjectCard({ project }: ProjectCardProps) {
  const created = new Date(project.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })

  return (
    <Link
      to="/dashboard/$projectId"
      params={{ projectId: project.id }}
      className="block border border-hairline bg-paper p-5 hover:border-hairline-strong transition-colors min-h-[120px]"
    >
      <h3 className="text-sm font-bold text-ink">{project.name}</h3>
      {project.description && (
        <p className="mt-1.5 text-xs text-ink-soft line-clamp-2">{project.description}</p>
      )}
      <p className="mt-auto pt-4 text-[10px] font-mono text-ink-soft">Created {created}</p>
    </Link>
  )
}
