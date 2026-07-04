export function ProjectGridSkeleton() {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border border-hairline bg-paper p-5 min-h-[120px] flex flex-col"
        >
          <div className="h-5 w-32 bg-zinc-800 rounded" />
          <div className="mt-1.5 h-4 w-full max-w-[240px] bg-zinc-900 rounded" />
          <div className="mt-auto pt-4">
            <div className="h-3 w-28 bg-zinc-800/50 rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}
