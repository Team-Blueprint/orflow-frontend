export function PlansTableSkeleton() {
  return (
    <div className="mt-4 animate-pulse">
      {/* Desktop skeleton */}
      <div className="hidden lg:block">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className="text-left px-4 py-3" />
              <th className="text-left px-4 py-3" />
              <th className="text-left px-4 py-3" />
              <th className="text-left px-4 py-3" />
              <th className="text-left px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 3 }).map((_, i) => (
              <tr key={i} className="border-b border-hairline">
                <td className="px-4 py-3">
                  <div className="h-5 w-36 bg-zinc-800 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-20 bg-zinc-900 rounded" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-6 w-16 bg-zinc-900 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-14 bg-zinc-900/60 rounded-full" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-24 bg-zinc-900/50 rounded" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile skeleton */}
      <div className="mt-4 flex flex-col gap-3 lg:hidden">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="border border-hairline bg-paper p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="h-5 w-36 bg-zinc-800 rounded" />
                <div className="h-5 w-20 bg-zinc-900 rounded" />
              </div>
              <div className="h-5 w-14 bg-zinc-900/60 rounded-full" />
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-6 w-16 bg-zinc-900 rounded-full" />
              <div className="h-5 w-24 bg-zinc-900/50 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
