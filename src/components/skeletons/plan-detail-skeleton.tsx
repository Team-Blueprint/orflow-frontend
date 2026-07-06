export function PlanDetailSkeleton() {
  return (
    <div className="p-4 sm:px-8 sm:pt-4 sm:pb-8 flex gap-6 min-h-[600px]">
      {/* Left Control Panel Skeleton (40%) */}
      <div className="w-[40%] flex flex-col gap-4 shrink-0">
        <div className="animate-pulse flex items-center justify-between gap-4">
          <div className="h-7 w-48 bg-zinc-800" />
          <div className="h-6 w-20 bg-zinc-800/50" />
        </div>
        <div className="animate-pulse flex-1 border border-hairline bg-paper p-5 flex flex-col gap-4">
          <div className="h-4 w-24 bg-zinc-800" />
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-zinc-800/50" />
              <div className="h-10 w-full bg-zinc-900" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-zinc-800/50" />
              <div className="h-10 w-full bg-zinc-900" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-zinc-800/50" />
              <div className="h-10 w-full bg-zinc-900" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-20 bg-zinc-800/50" />
              <div className="h-10 w-full bg-zinc-900" />
            </div>
          </div>
        </div>
        <div className="animate-pulse flex gap-3 border-t border-hairline pt-4">
          <div className="h-10 w-32 bg-zinc-800 flex-1" />
          <div className="h-10 w-28 bg-zinc-900/50" />
        </div>
      </div>

      {/* Right Panel Skeleton (60%) */}
      <div className="flex-1 flex flex-col gap-4">
        <div className="animate-pulse border border-hairline bg-paper p-5 flex flex-col gap-4">
          <div className="h-4 w-36 bg-zinc-800" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-zinc-900" />
          ))}
        </div>
        <div className="animate-pulse border border-hairline bg-paper p-5">
          <div className="h-4 w-24 bg-zinc-800 mb-4" />
          <div className="h-10 w-full bg-zinc-900" />
        </div>
      </div>
    </div>
  )
}
