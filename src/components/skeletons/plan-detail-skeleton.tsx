export function PlanDetailSkeleton() {
  return (
    <div className="mx-auto max-w-7xl p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="animate-pulse flex flex-col gap-3">
          <div className="h-3 w-24 bg-zinc-800/50" />
          <div className="h-8 w-64 bg-zinc-800" />
          <div className="h-4 w-48 bg-zinc-800/50" />
          <div className="flex gap-4">
            <div className="h-3 w-28 bg-zinc-800/30" />
            <div className="h-3 w-28 bg-zinc-800/30" />
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-[40%] flex flex-col gap-4">
            <div className="animate-pulse border border-hairline bg-paper p-6 flex flex-col gap-6">
              <div className="h-5 w-32 bg-zinc-800" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex flex-col gap-1.5">
                    <div className="h-3 w-20 bg-zinc-800/50" />
                    <div className="h-10 w-full bg-zinc-900" />
                  </div>
                ))}
              </div>
            </div>
            <div className="animate-pulse flex flex-col sm:flex-row gap-2">
              <div className="h-10 w-full bg-zinc-800" />
              <div className="h-10 w-full bg-zinc-900/50" />
            </div>
          </div>

          <div className="lg:w-[60%] flex flex-col gap-4">
            <div className="animate-pulse border border-hairline bg-paper p-5 flex flex-col gap-4">
              <div className="h-4 w-40 bg-zinc-800" />
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-10 w-full bg-zinc-900" />
              ))}
            </div>
            <div className="animate-pulse border border-hairline bg-paper p-5">
              <div className="h-4 w-28 bg-zinc-800 mb-4" />
              <div className="h-10 w-full bg-zinc-900" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
