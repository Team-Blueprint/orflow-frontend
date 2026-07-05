import { useMemo, useState } from "react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useDebounce } from "@/hooks/use-debounce"
import { Badge } from "@/components/ui/badge"
import { formatNaira } from "@/lib/currency"
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
  projectId: string
}

const INTERVAL_FILTERS = [
  "All", "Daily", "Weekly", "Monthly", "Quarterly", "Yearly",
] as const

export function PlansTable({ plans, projectId }: PlansTableProps) {
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
      <div className="hidden lg:block mt-4 border border-hairline bg-paper overflow-x-auto">
        <table className="w-full border-collapse">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[22%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[18%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-hairline bg-midnight-soft">
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Name</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Amount</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Interval</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Status</th>
              <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((plan) => (
              <PlanRow key={plan.id} plan={plan} projectId={projectId} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="mt-4 flex flex-col gap-3 lg:hidden">
        {filtered.map((plan) => (
          <Link
            key={plan.id}
            to="/dashboard/$projectId/plans/$planId"
            params={{ projectId, planId: plan.id }}
            className="block border border-hairline bg-paper p-4 hover:bg-paper/40 transition-colors cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{plan.name}</p>
                <p className="mt-1 text-lg font-mono text-ink">
                  {formatNaira(plan.amount)}
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
          </Link>
        ))}
      </div>
    </div>
  )
}

function PlanRow({ plan, projectId }: { plan: Plan; projectId: string }) {
  const navigate = useNavigate()
  return (
    <tr
      onClick={() => navigate({ to: "/dashboard/$projectId/plans/$planId", params: { projectId, planId: plan.id } })}
      onKeyDown={(e) => { if (e.key === "Enter") navigate({ to: "/dashboard/$projectId/plans/$planId", params: { projectId, planId: plan.id } }) }}
      tabIndex={0}
      className="border-b border-hairline last:border-0 hover:bg-midnight-soft/30 transition-colors cursor-pointer"
    >
      <td className="px-4 py-3">
        <div className="text-sm font-bold text-ink">{plan.name}</div>
      </td>
      <td className="px-4 py-3 text-sm text-ink font-mono">
        {formatNaira(plan.amount)}
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
