export function ProjectGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border border-hairline bg-zinc-900/50 p-5 min-h-[140px] flex flex-col"
        >
          <div className="flex items-start gap-3">
            <div className="h-5 w-5 bg-zinc-800 shrink-0" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-zinc-800" />
              <div className="mt-2 h-4 w-full max-w-[200px] bg-zinc-900" />
            </div>
          </div>
          <div className="mt-auto pt-5">
            <div className="h-3 w-28 bg-zinc-800/50" />
          </div>
        </div>
      ))}
    </div>
  )
}
