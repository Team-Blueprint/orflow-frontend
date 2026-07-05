export function AnalyticsSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border border-hairline bg-paper p-4 sm:p-5">
            <div className="h-3 w-20 bg-zinc-800 rounded" />
            <div className="mt-3 h-6 w-28 bg-zinc-800/70 rounded" />
          </div>
        ))}
      </div>

      <div className="mt-3 sm:mt-4">
        <div className="border border-hairline bg-paper p-4 sm:p-5">
          <div className="h-4 w-36 bg-zinc-800 rounded mb-4" />
          <div className="h-48 bg-zinc-900/50 rounded" />
        </div>
      </div>
    </div>
  )
}
