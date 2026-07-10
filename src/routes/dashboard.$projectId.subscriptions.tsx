import { useState, useMemo } from "react"
import { createFileRoute, useParams, useNavigate } from "@tanstack/react-router"
import { useQuery } from "@tanstack/react-query"
import { useSubscriptions, useCancelSubscription, usePauseSubscription, useResumeSubscription, useSubscriptionAuditLog } from "@/api/hooks/useSubscriptions"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import type { Subscription, AuditLogEntry } from "@/api/types/subscriptions"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import { formatNaira } from "@/lib/currency"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog as DialogPrimitive } from "radix-ui"
import { ChartSquare, Refresh } from "@/lib/icons"
import { useToast } from "@/components/webhooks/utils/toast"
import { SubscriptionsSkeleton } from "@/components/skeletons/subscriptions-skeleton"

export const Route = createFileRoute("/dashboard/$projectId/subscriptions")({
  validateSearch: (search: Record<string, unknown>) => ({
    plan_id: search.plan_id as string | undefined,
  }),
  component: SubscriptionsPage,
})

const STATUS_FILTERS = ["all", "incomplete", "incomplete_expired", "trialing", "active", "past_due", "unpaid", "paused", "canceled", "defaulted", "completed"] as const

const STATUS_BADGE: Record<string, "success" | "destructive" | "muted" | "info"> = {
  active: "success",
  trialing: "info",
  past_due: "destructive",
  unpaid: "destructive",
  paused: "info",
  canceled: "muted",
  defaulted: "destructive",
  completed: "muted",
  incomplete: "muted",
  incomplete_expired: "muted",
}

interface Plan {
  id: string
  name: string
}

function SubscriptionsPage() {
  const { projectId } = useParams({ from: "/dashboard/$projectId/subscriptions" })
  const navigate = useNavigate()
  const { plan_id } = Route.useSearch() as { plan_id?: string }
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)

  const { data: plans = [] } = useQuery<Plan[]>({
    queryKey: ["plans", projectId],
    queryFn: () => apiClient.get(ENDPOINTS.PLANS.LIST).then(res => res.data),
  })

  const planFilter = plan_id ?? ""

  const { data: subscriptions = [], isLoading, refetch } = useSubscriptions(projectId, planFilter || undefined)
  const cancelMutation = useCancelSubscription(projectId)
  const pauseMutation = usePauseSubscription(projectId)
  const resumeMutation = useResumeSubscription(projectId)
  const { data: auditLog = [] } = useSubscriptionAuditLog(activeId)
  const toast = useToast()

  function setPlanFilter(value: string) {
    navigate({
      to: "/dashboard/$projectId/subscriptions",
      params: { projectId },
      search: { plan_id: value || undefined },
      replace: true,
    })
  }

  const filtered = useMemo(() => {
    return subscriptions.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false
      if (search) {
        const q = search.toLowerCase()
        return (
          (s.customer_email ?? "").toLowerCase().includes(q) ||
          (s.customer_name ?? "").toLowerCase().includes(q) ||
          (s.plan_name ?? "").toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [subscriptions, statusFilter, search])

  const activeSub = useMemo(
    () => subscriptions.find((s) => s.id === activeId) ?? null,
    [subscriptions, activeId],
  )

  function selectDesktop(sub: Subscription) {
    setActiveId(sub.id)
  }

  function selectMobile(sub: Subscription) {
    setActiveId(sub.id)
    setMobileOpen(true)
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  const isMutating = cancelMutation.isPending || pauseMutation.isPending || resumeMutation.isPending

  function handleCancel(sub: Subscription) {
    if (sub.status === "active" || sub.status === "paused") {
      toast.loading("Processing request...")
      cancelMutation.mutate(sub.id, {
        onSuccess: () => toast.success("Subscription status updated"),
        onError: () => toast.error("Could not modify subscription"),
      })
    }
  }

  function handlePause(sub: Subscription) {
    if (sub.status === "active") {
      toast.loading("Processing request...")
      pauseMutation.mutate(sub.id, {
        onSuccess: () => toast.success("Subscription status updated"),
        onError: () => toast.error("Could not modify subscription"),
      })
    }
  }

  function handleResume(sub: Subscription) {
    if (sub.status === "paused") {
      toast.loading("Processing request...")
      resumeMutation.mutate(sub.id, {
        onSuccess: () => toast.success("Subscription status updated"),
        onError: () => toast.error("Could not modify subscription"),
      })
    }
  }

  useDocumentTitle("Subscriptions | Orflow")

  return (
    <div className="p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="flex items-center justify-between mb-5 sm:mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Subscriptions</h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
            Monitor and manage all active subscriptions across your plans.
          </p>
        </div>
        <button
          type="button"
          onClick={() => refetch()}
          className="border border-hairline bg-canvas px-3 py-2.5 text-ink-soft hover:text-ink hover:bg-midnight-soft transition-colors cursor-pointer"
          aria-label="Refresh"
        >
          <Refresh className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
        <Select value={planFilter || "all"} onValueChange={(v) => setPlanFilter(v === "all" ? "" : v)}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All plans" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All plans</SelectItem>
            {plans.map((p) => (
              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f} value={f} className="capitalize">
                {f === "past_due" ? "Past Due" : f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search by name, email, plan..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="sm:max-w-xs bg-canvas border border-hairline text-sm"
        />
      </div>

      {isLoading ? (
        <SubscriptionsSkeleton />
      ) : (
        <>
          {/* Desktop split layout */}
          <div className="hidden lg:flex gap-4 items-start">
            <div className="w-[60%] border border-hairline bg-paper overflow-x-auto">
              <SubscriptionTable
                subscriptions={filtered}
                activeId={activeId}
                onSelect={selectDesktop}
              />
            </div>
            <div className="w-[40%] sticky top-4">
              <div className="border border-hairline bg-paper">
                  {activeSub ? (
                    <SubscriptionDetailPanel
                      sub={activeSub}
                      auditLog={auditLog}
                      onCancel={handleCancel}
                      onPause={handlePause}
                      onResume={handleResume}
                      isMutating={isMutating}
                    />
                  ) : (
                    <EmptyDetail />
                  )}
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="lg:hidden border border-hairline bg-paper overflow-x-auto">
            <SubscriptionTable
              subscriptions={filtered}
              activeId={activeId}
              onSelect={selectMobile}
            />
          </div>

          {/* Mobile slide-over — only renders on mobile */}
          <div className="block md:hidden">
            <SlideOver open={mobileOpen} onClose={closeMobile}>
              {activeSub && (
                <SubscriptionDetailPanel
                  sub={activeSub}
                  auditLog={auditLog}
                  onCancel={handleCancel}
                  onPause={handlePause}
                  onResume={handleResume}
                  isMutating={isMutating}
                  onClose={closeMobile}
                />
              )}
            </SlideOver>
          </div>
        </>
      )}
    </div>
  )
}

/* ─── Master Table ─────────────────────────────────── */

function SubscriptionTable({
  subscriptions,
  activeId,
  onSelect,
}: {
  subscriptions: Subscription[]
  activeId: string | null
  onSelect: (s: Subscription) => void
}) {
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <ChartSquare size={24} className="text-zinc-700" />
        <p className="text-sm text-ink-soft">No subscriptions found</p>
      </div>
    )
  }

  return (
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
        <tr className="border-b border-hairline bg-midnight-soft text-xs font-medium text-ink-soft">
          <th className="px-4 py-3 font-medium">Plan</th>
          <th className="px-4 py-3 font-medium">Subscriber</th>
          <th className="px-4 py-3 font-medium">Amount</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Started</th>
          <th className="px-4 py-3 font-medium">Next</th>
        </tr>
      </thead>
      <tbody>
        {subscriptions.map((sub) => (
          <tr
            key={sub.id}
            onClick={() => onSelect(sub)}
            onKeyDown={(e) => { if (e.key === "Enter") onSelect(sub) }}
            tabIndex={0}
            className={cn(
              "border-b border-hairline last:border-0 transition-colors cursor-pointer",
              activeId === sub.id ? "bg-primary/10" : "hover:bg-midnight-soft/30",
            )}
          >
            <td className="px-4 py-3 font-medium text-ink">{sub.plan_name}</td>
            <td className="px-4 py-3">
              <div className="text-ink">{sub.customer_name}</div>
              <div className="text-[11px] text-ink-soft truncate">{sub.customer_email}</div>
            </td>
            <td className="px-4 py-3 font-mono text-sm text-ink">{formatNaira(sub.amount ?? 0)}</td>
            <td className="px-4 py-3">
              <Badge variant={STATUS_BADGE[sub.status] ?? "muted"} className="capitalize text-[10px]">
                {sub.status === "past_due" ? "Past Due" : sub.status === "incomplete_expired" ? "Expired" : sub.status}
              </Badge>
            </td>
            <td className="px-4 py-3 text-xs text-ink-soft font-mono">
              {new Date(sub.current_period_start ?? sub.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </td>
            <td className="px-4 py-3 text-xs text-ink-soft font-mono">
              {sub.current_period_end
                ? new Date(sub.current_period_end).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                : "—"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ─── Empty Detail State ──────────────────────────── */

function EmptyDetail() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] px-6 py-12 text-center">
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" className="text-zinc-700">
        <rect x="2" y="2" width="20" height="20" rx="2" />
        <path d="M8 2v20" />
        <path d="M16 2v20" />
        <path d="M2 8h20" />
        <path d="M2 16h20" />
      </svg>
      <p className="mt-4 text-sm text-ink-soft font-medium">Select a subscription</p>
      <p className="mt-1 text-xs text-zinc-600 max-w-[200px]">Choose a row from the table to view full details and actions.</p>
    </div>
  )
}

/* ─── Detail Panel ────────────────────────────────── */

function SubscriptionDetailPanel({
  sub,
  auditLog,
  onCancel,
  onPause,
  onResume,
  isMutating,
  onClose,
}: {
  sub: Subscription
  auditLog: AuditLogEntry[]
  onCancel: (s: Subscription) => void
  onPause: (s: Subscription) => void
  onResume: (s: Subscription) => void
  isMutating: boolean
  onClose?: () => void
}) {
  function fmtDate(d: string | null) {
    if (!d) return "—"
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-hairline px-5 py-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink tracking-tight">Subscription Details</h2>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-ink-soft hover:text-ink transition-colors cursor-pointer"
            style={{ minHeight: 44, minWidth: 44 }}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="px-5 py-4 space-y-6">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-3">Customer</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/15 text-primary text-sm font-bold flex items-center justify-center">
              {(sub.customer_name ?? "").split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">{sub.customer_name ?? "—"}</p>
              <p className="text-xs text-ink-soft">{sub.customer_email ?? "—"}</p>
            </div>
          </div>
          {sub.payment_method_id && (
            <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft border border-hairline bg-canvas px-3 py-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-500">
                <rect x="1" y="4" width="22" height="16" rx="2" />
                <path d="M1 10h22" />
              </svg>
              <span className="font-mono">ID: </span>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(sub.payment_method_id!)}
                className="font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{sub.payment_method_id.slice(0, 8)}…{sub.payment_method_id.slice(-4)}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </div>
          )}
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-3">Subscription</p>
          <div className="space-y-3">
            <DetailRow label="ID" value={sub.id.slice(0, 8) + "…" + sub.id.slice(-4)} mono>
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(sub.id)}
                className="text-[10px] font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>{sub.id.slice(0, 8)}…{sub.id.slice(-4)}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              </button>
            </DetailRow>
            <DetailRow label="Plan" value={sub.plan_name ?? "—"} />
            <DetailRow label="Amount" value={formatNaira(sub.amount ?? 0)} mono />
            <DetailRow label="Type" value={sub.type} capitalize />
            <DetailRow label="Status" value={sub.status === "past_due" ? "Past Due" : sub.status === "incomplete_expired" ? "Expired" : sub.status} capitalize>
              <Badge variant={STATUS_BADGE[sub.status] ?? "muted"} className="capitalize text-[10px]">
                {sub.status === "past_due" ? "Past Due" : sub.status === "incomplete_expired" ? "Expired" : sub.status}
              </Badge>
            </DetailRow>
            <DetailRow label="Started" value={fmtDate(sub.current_period_start ?? sub.created_at)} />
            <DetailRow label="Next billing" value={fmtDate(sub.current_period_end)} />
            {sub.trial_end && <DetailRow label="Trial ends" value={fmtDate(sub.trial_end)} />}
            {sub.canceled_at && <DetailRow label="Canceled" value={fmtDate(sub.canceled_at)} />}
            {sub.cancel_at_period_end && (
              <DetailRow label="Cancel at period end" value="Yes" />
            )}
          </div>
        </div>

        {(sub.status === "active" || sub.status === "past_due" || sub.status === "paused") && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-3">Quick Actions</p>
            <div className="flex flex-col gap-2">
              {(sub.status === "active" || sub.status === "past_due") && (
                <button
                  type="button"
                  onClick={() => onPause(sub)}
                  disabled={isMutating}
                  className="w-full border border-hairline bg-canvas px-4 py-2.5 text-xs font-medium text-ink hover:bg-midnight-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Pause subscription
                </button>
              )}
              {sub.status === "paused" && (
                <button
                  type="button"
                  onClick={() => onResume(sub)}
                  disabled={isMutating}
                  className="w-full border border-hairline bg-canvas px-4 py-2.5 text-xs font-medium text-ink hover:bg-midnight-soft transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Resume subscription
                </button>
              )}
              {(sub.status === "active" || sub.status === "paused" || sub.status === "past_due") && (
                <button
                  type="button"
                  onClick={() => onCancel(sub)}
                  disabled={isMutating}
                  className="w-full bg-red-950/40 border border-red-900/50 px-4 py-2.5 text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Cancel subscription
                </button>
              )}
            </div>
          </div>
        )}

        {auditLog.length > 0 && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-3">Activity Log</p>
            <div className="flex flex-col">
              {auditLog.map((entry, idx) => (
                <div key={entry.id} className="flex gap-3 py-2.5 border-b border-hairline last:border-0">
                  <div className="flex flex-col items-center gap-1">
                    <div className="size-2 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                    {idx < auditLog.length - 1 && <div className="w-px flex-1 bg-hairline" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-ink capitalize">
                        {entry.old_status ?? "—"} → {entry.new_status}
                      </span>
                      <span className="text-[10px] text-ink-soft font-mono">
                        {new Date(entry.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </span>
                    </div>
                    {entry.reason && (
                      <p className="text-[11px] text-ink-soft mt-0.5">{entry.reason}</p>
                    )}
                    <p className="text-[10px] text-ink-soft/60 mt-0.5">by {entry.actor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function DetailRow({
  label,
  value,
  mono,
  capitalize,
  children,
}: {
  label: string
  value: string
  mono?: boolean
  capitalize?: boolean
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-ink-soft shrink-0">{label}</span>
      {children ?? (
        <span className={cn(
          "text-xs text-ink text-right",
          mono && "font-mono",
          capitalize && "capitalize",
        )}>
          {value}
        </span>
      )}
    </div>
  )
}

/* ─── Mobile Slide-Over ──────────────────────────── */

function SlideOver({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className="fixed inset-0 z-[65] bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <DialogPrimitive.Content
          className={cn(
            "fixed inset-y-0 right-0 z-[70] w-full max-w-md border-l border-hairline bg-paper shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right",
            "duration-200",
          )}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
