export function ApiKeysSkeleton() {
  return (
    <div className="mt-6 flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse border border-hairline bg-paper"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4">
            <div className="flex-1 min-w-0 flex items-center gap-4">
              <div className="h-4 w-16 bg-zinc-800 rounded shrink-0" />
              <div className="h-4 w-48 bg-zinc-900/50 rounded" />
            </div>
            <div className="h-8 w-24 bg-zinc-800 rounded shrink-0" />
          </div>
        </div>
      ))}
    </div>
  )
}
