export function WebhookSkeleton() {
  return (
    <div className="flex flex-col gap-5 sm:gap-6 p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="border border-hairline bg-midnight-soft p-6 animate-pulse">
        <div className="h-6 w-48 bg-midnight/50 mb-4" />
        <div className="space-y-4">
          <div className="h-4 w-32 bg-midnight/50" />
          <div className="h-10 w-full bg-midnight/50" />
          <div className="h-4 w-32 bg-midnight/50" />
          <div className="h-10 w-full bg-midnight/50" />
          <div className="h-4 w-32 bg-midnight/50" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 bg-midnight/50" />
            <div className="h-4 w-24 bg-midnight/50" />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-hairline">
          <div className="h-10 w-24 bg-midnight/50" />
          <div className="h-10 w-32 bg-midnight/50" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border border-hairline bg-midnight-soft p-4">
            <div className="h-4 w-24 bg-midnight/50 mb-2" />
            <div className="h-8 w-16 bg-midnight/50" />
          </div>
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto animate-pulse">
        <div className="h-11 w-48 bg-midnight/50" />
        <div className="h-11 w-40 bg-midnight/50" />
      </div>

      <div className="hidden lg:block overflow-x-auto border border-hairline animate-pulse">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-midnight/50">
              <th className="px-4 py-3" /><th className="px-4 py-3" /><th className="px-4 py-3" />
              <th className="px-4 py-3" /><th className="px-4 py-3" /><th className="px-4 py-3" />
              <th className="px-4 py-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="border-b border-hairline">
                <td className="px-4 py-3"><div className="h-4 w-20 bg-midnight/50" /></td>
                <td className="px-4 py-3"><div className="h-4 w-16 bg-midnight/50 font-mono" /></td>
                <td className="px-4 py-3"><div className="h-4 w-24 bg-midnight/50" /></td>
                <td className="px-4 py-3"><div className="h-4 w-28 bg-midnight/50" /></td>
                <td className="px-4 py-3"><div className="h-4 w-16 bg-midnight/50" /></td>
                <td className="px-4 py-3"><div className="h-4 w-8 bg-midnight/50" /></td>
                <td className="px-4 py-3" />
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-hairline animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="py-3">
            <div className="h-4 w-20 bg-midnight/50 mb-1" />
            <div className="h-4 w-3/4 bg-midnight/50 mb-1" />
            <div className="h-3 w-1/2 bg-midnight/50 mb-0.5" />
            <div className="h-3 w-1/3 bg-midnight/50" />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 animate-pulse">
        <div className="h-10 w-32 bg-midnight/50" />
      </div>
    </div>
  );
}
