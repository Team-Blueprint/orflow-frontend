export function SubscriptionsSkeleton() {
  return (
    <div className="animate-pulse border border-hairline bg-paper overflow-x-auto">
      <table className="w-full text-left text-sm">
        <colgroup>
          <col className="w-[22%]" />
          <col className="w-[25%]" />
          <col className="w-[18%]" />
          <col className="w-[12%]" />
          <col className="w-[12%]" />
          <col className="w-[11%]" />
        </colgroup>
        <thead>
          <tr className="border-b border-hairline bg-midnight-soft">
            {["Plan", "Subscriber", "Amount", "Status", "Started", "Next"].map((h) => (
              <th key={h} className="px-4 py-3 text-xs font-medium text-ink-soft">
                <div className="h-3 w-14 bg-zinc-800 rounded" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: 6 }).map((_, i) => (
            <tr key={i} className="border-b border-hairline last:border-0">
              <td className="px-4 py-3">
                <div className="h-4 w-24 bg-zinc-800 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-28 bg-zinc-800 rounded" />
                <div className="mt-1 h-3 w-36 bg-zinc-900/50 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-4 w-16 bg-zinc-800 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-5 w-14 bg-zinc-800 rounded-full" />
              </td>
              <td className="px-4 py-3">
                <div className="h-3 w-20 bg-zinc-800 rounded" />
              </td>
              <td className="px-4 py-3">
                <div className="h-3 w-20 bg-zinc-800 rounded" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
