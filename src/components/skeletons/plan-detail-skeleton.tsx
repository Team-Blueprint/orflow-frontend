export function PlanDetailSkeleton() {
  return (
    <div className="p-4 sm:px-8 sm:pt-4 sm:pb-8 flex gap-6 min-h-[600px]">
      {/* Left Control Panel Skeleton (40%) */}
      <div className="w-[40%] flex flex-col gap-4 shrink-0">
        {/* Header skeleton */}
        <div className="animate-pulse flex items-center justify-between gap-4">
          <div className="h-7 w-48 bg-zinc-800 rounded" />
          <div className="h-6 w-20 bg-zinc-800/50 rounded-full" />
        </div>

        {/* Config card skeleton */}
        <div className="animate-pulse flex-1 border border-hairline bg-paper p-5 flex flex-col gap-4">
          <div className="h-4 w-24 bg-zinc-800 rounded" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-zinc-800/50 rounded" />
              <div className="h-10 w-full bg-zinc-900 rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-zinc-800/50 rounded" />
              <div className="h-10 w-full bg-zinc-900 rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-zinc-800/50 rounded" />
              <div className="h-10 w-full bg-zinc-900 rounded" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-zinc-800/50 rounded" />
              <div className="h-10 w-full bg-zinc-900 rounded" />
            </div>
          </div>
        </div>

        {/* Footer actions skeleton */}
        <div className="animate-pulse flex gap-3 border-t border-hairline pt-4">
          <div className="h-10 w-32 bg-zinc-800 rounded flex-1" />
          <div className="h-10 w-28 bg-zinc-900/50 rounded" />
        </div>
      </div>

      {/* Right Telemetry Deck Skeleton (60%) */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Tab bar skeleton */}
        <div className="animate-pulse flex gap-1 border-b border-hairline">
          <div className="h-10 w-28 bg-zinc-800 rounded-t" />
          <div className="h-10 w-28 bg-zinc-900/50 rounded-t" />
          <div className="h-10 w-32 bg-zinc-900/50 rounded-t" />
        </div>

        {/* Tab content skeleton */}
        <div className="animate-pulse flex-1 border border-hairline bg-paper p-5 flex flex-col gap-4">
          {/* List skeleton - 4 items */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="h-5 w-32 bg-zinc-800 rounded" />
              <div className="h-4 w-20 bg-zinc-900/50 rounded" />
              <div className="h-4 w-24 bg-zinc-900 rounded-full" />
              <div className="flex-1" />
              <div className="h-8 w-20 bg-zinc-800 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}