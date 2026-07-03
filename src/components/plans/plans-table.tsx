import { useMemo, useState } from "react"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface Plan {
  id: string
  name: string
  amount: number
  currency: string
  interval: string
  interval_count: number
  trial_period_days: number | null
  installments_count: number | null
  status: "active" | "archived"
  created_at: string
}

interface PlansTableProps {
  plans: Plan[]
}

const INTERVAL_FILTERS = [
  "All", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly",
] as const

export function PlansTable({ plans }: PlansTableProps) {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [intervalFilter, setIntervalFilter] = useState("all")

  const debouncedSearch = useDebounce(search, 300)

  const filtered = useMemo(() => {
    return plans.filter((plan) => {
      if (statusFilter === "active" && plan.status !== "active") return false
      if (statusFilter === "archived" && plan.status !== "archived") return false
      if (
        intervalFilter !== "all" &&
        plan.interval.toLowerCase() !== intervalFilter.toLowerCase()
      ) return false
      if (
        debouncedSearch &&
        !plan.name.toLowerCase().includes(debouncedSearch.toLowerCase())
      ) return false
      return true
    })
  }, [plans, debouncedSearch, statusFilter, intervalFilter])

  if (plans.length === 0) {
    return (
      <div className="mt-16 flex flex-col items-center justify-center text-center">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
        <p className="mt-4 text-sm text-ink-soft max-w-xs leading-relaxed">
          No plans yet. Create your first pricing tier.
        </p>
      </div>
    )
  }

  if (filtered.length === 0) {
    return (
      <>
        <Filters {...{ search, setSearch, statusFilter, setStatusFilter, intervalFilter, setIntervalFilter }} />
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-ink-soft">No plans match your current search criteria.</p>
        </div>
      </>
    )
  }

  return (
    <div>
      <Filters {...{ search, setSearch, statusFilter, setStatusFilter, intervalFilter, setIntervalFilter }} />

      {/* Desktop table */}
      <div className="hidden lg:block mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-hairline">
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Name</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Amount</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Interval</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Status</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((plan) => (
              <tr key={plan.id} className="border-b border-hairline hover:bg-paper/40 transition-colors">
                <td className="px-4 py-3 text-sm font-bold text-ink">{plan.name}</td>
                <td className="px-4 py-3 text-sm text-ink font-mono">
                  ₦{Number(plan.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-ink-soft bg-paper border border-hairline px-2 py-0.5">
                    {plan.interval}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                    {plan.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft font-mono">
                  {new Date(plan.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-4 flex flex-col gap-3 lg:hidden">
        {filtered.map((plan) => (
          <div key={plan.id} className="border border-hairline bg-paper p-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{plan.name}</p>
                <p className="mt-1 text-lg font-mono text-ink">
                  ₦{Number(plan.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <Badge variant={plan.status === "active" ? "default" : "secondary"}>
                {plan.status}
              </Badge>
            </div>
            <div className="mt-3 flex items-center gap-3 text-[10px] text-ink-soft">
              <span className="font-semibold uppercase tracking-wider bg-paper border border-hairline px-2 py-0.5">
                {plan.interval}
              </span>
              <span className="font-mono">
                {new Date(plan.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Filters({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  intervalFilter,
  setIntervalFilter,
}: {
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  intervalFilter: string
  setIntervalFilter: (v: string) => void
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search plans…"
        className="flex-1 bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors min-w-0"
      />
      <div className="flex gap-2">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select value={intervalFilter} onValueChange={setIntervalFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All intervals</SelectItem>
            {INTERVAL_FILTERS.filter((i) => i !== "All").map((i) => (
              <SelectItem key={i} value={i.toLowerCase()}>
                {i}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
