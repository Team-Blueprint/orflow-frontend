import { useState, useMemo } from "react"
import { createFileRoute, useParams } from "@tanstack/react-router"
import { useCustomers } from "@/api/hooks/useCustomers"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CreateCustomerModal } from "@/components/customers/create-customer-modal"

export const Route = createFileRoute("/dashboard/$projectId/customers")({
  component: CustomersPage,
})

const STATUS_FILTERS = ["all", "active", "inactive", "suspended"] as const

const STATUS_BADGE: Record<string, "success" | "muted" | "destructive"> = {
  active: "success",
  inactive: "muted",
  suspended: "destructive",
}

function CustomersPage() {
  const { projectId } = useParams({ from: "/dashboard/$projectId/customers" })
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [page, setPage] = useState(0)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const limit = 15

  const { data: customersData, isLoading } = useCustomers(projectId, { offset: page * limit, limit })

  const filtered = useMemo(() => {
    const raw = customersData?.data ?? []

    let q: string
    try {
      q = search.toLowerCase().trim()
    } catch { q = "" }

    return raw.filter((c) => {
      if (statusFilter !== "all" && c.activity_status !== statusFilter) return false
      if (q && !c.email.toLowerCase().includes(q) && !c.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [customersData, search, statusFilter])

  const totalPages = customersData ? Math.ceil(customersData.total / limit) : 1

  return (
    <div className="p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Customers</h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
            View and manage your customer base.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateModalOpen(true)}
          className="btn-primary text-sm font-bold px-5 py-2.5 cursor-pointer"
        >
          New Customer
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <Input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0) }}
          placeholder="Search customers…"
          className="flex-1 bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors min-w-0"
        />
        <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(0) }}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f} value={f}>
                {f === "all" ? "All statuses" : f.charAt(0).toUpperCase() + f.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Loading */}
      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 w-full bg-zinc-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center text-center">
          <p className="text-sm text-ink-soft">No customers found.</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block border border-hairline bg-paper overflow-x-auto">
            <table className="w-full border-collapse">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[22%]" />
                <col className="w-[14%]" />
                <col className="w-[16%]" />
                <col className="w-[14%]" />
                <col className="w-[12%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-hairline bg-midnight-soft">
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Name</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Email</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Status</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Plan</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Last Seen</th>
                  <th className="text-left text-[10px] font-bold uppercase tracking-widest text-ink-soft px-4 py-3">Created</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className="border-b border-hairline last:border-0 hover:bg-midnight-soft/30 transition-colors">
                    <td className="px-4 py-3 text-sm font-bold text-ink">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-ink-soft">{c.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={STATUS_BADGE[c.activity_status] ?? "muted"} className="capitalize text-xs">
                        {c.activity_status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-soft">{c.plan_name ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-ink-soft font-mono">
                      {c.last_seen
                        ? new Date(c.last_seen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                        : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-soft font-mono">
                      {new Date(c.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 lg:hidden">
            {filtered.map((c) => (
              <div key={c.id} className="border border-hairline bg-paper p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-bold text-ink">{c.name}</p>
                    <p className="text-xs text-ink-soft mt-0.5">{c.email}</p>
                  </div>
                  <Badge variant={STATUS_BADGE[c.activity_status] ?? "muted"} className="shrink-0 capitalize text-xs">
                    {c.activity_status}
                  </Badge>
                </div>
                <div className="mt-3 flex items-center gap-3 text-[10px] text-ink-soft">
                  <span className="font-semibold uppercase tracking-wider bg-paper border border-hairline px-2 py-0.5">
                    {c.plan_name ?? "No plan"}
                  </span>
                  <span className="font-mono">
                    {c.last_seen
                      ? new Date(c.last_seen).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                      : "Never"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
            <span>
              {customersData?.total ?? 0} total
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 border border-hairline bg-paper text-ink-soft hover:text-ink hover:border-hairline-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="font-mono">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 border border-hairline bg-paper text-ink-soft hover:text-ink hover:border-hairline-strong transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      <CreateCustomerModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        projectId={projectId}
      />
    </div>
  )
}
