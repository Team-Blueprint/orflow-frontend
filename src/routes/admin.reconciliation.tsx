import { useState, useMemo, useEffect } from "react"
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router"
import { useDiscrepancies, useResolveDiscrepancy } from "@/api/hooks/useReconciliation"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { useAuth } from "@/lib/auth"
import type { ReconciliationDiscrepancy, DiscrepancyType } from "@/api/types/reconciliation"
import { formatNaira } from "@/lib/currency"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog as DialogPrimitive } from "radix-ui"
import { LogoIcon } from "@/components/icons"
import { ShieldCheck } from "@/lib/icons"
import { useToast } from "@/components/webhooks/utils/toast"
import { ProtectedRoute } from "@/components/protected-route"

export const Route = createFileRoute("/admin/reconciliation")({
  component: () => (
    <ProtectedRoute>
      <ReconciliationPage />
    </ProtectedRoute>
  ),
})

const DISCREPANCY_LABELS: Record<DiscrepancyType, string> = {
  missing_in_ours: "Missing in Orflow",
  missing_in_nomba: "Missing in Nomba",
  status_mismatch: "Status Mismatch",
  amount_mismatch: "Amount Mismatch",
}

const DISCREPANCY_TYPES: DiscrepancyType[] = [
  "missing_in_ours",
  "missing_in_nomba",
  "status_mismatch",
  "amount_mismatch",
]

function ReconciliationPage() {
  useDocumentTitle("Reconciliation Center | Orflow")
  const navigate = useNavigate()
  const { user } = useAuth()

  const [discrepancyType, setDiscrepancyType] = useState<DiscrepancyType | "">("")
  const [resolved, setResolved] = useState<boolean | "">("")
  const [runId, setRunId] = useState("")
  const [page, setPage] = useState(1)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [resolutionNote, setResolutionNote] = useState("")

  const admins = (import.meta.env.VITE_RECONCILIATION_ADMINS ?? "")
    .split(",")
    .map((s: string) => s.trim())
    .filter(Boolean)
  const isAdmin = !!(user?.email && admins.includes(user.email))

  useEffect(() => {
    if (!isAdmin) {
      navigate({ to: "/dashboard" })
    }
  }, [isAdmin, navigate])

  if (!isAdmin) return null

  const { data, isLoading } = useDiscrepancies({
    run_id: runId || undefined,
    discrepancy_type: discrepancyType || undefined,
    resolved: resolved !== "" ? resolved : undefined,
    page,
    per_page: 20,
  })

  const resolveMutation = useResolveDiscrepancy()
  const toast = useToast()

  const items = data?.items ?? []
  const total = data?.total ?? 0
  const totalPages = Math.ceil(total / 20)

  const activeItem = useMemo(
    () => items.find(d => d.id === activeId) ?? null,
    [items, activeId],
  )

  function selectDesktop(d: ReconciliationDiscrepancy) {
    setActiveId(d.id)
    setResolutionNote(d.resolution_note ?? "")
  }

  function selectMobile(d: ReconciliationDiscrepancy) {
    setActiveId(d.id)
    setMobileOpen(true)
    setResolutionNote(d.resolution_note ?? "")
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  async function handleResolve() {
    if (!activeItem || activeItem.resolved) return
    toast.loading("Applying structural adjustment fix...")
    resolveMutation.mutate(
      { id: activeItem.id, resolution_note: resolutionNote },
      {
        onSuccess: () => {
          setActiveId(null)
          setMobileOpen(false)
          toast.success("Discrepancy successfully resolved")
        },
        onError: () => {
          toast.error("Failed to resolve discrepancy")
        },
      },
    )
  }

  return (
    <>
      <header className="h-14 w-full bg-canvas/80 backdrop-blur-md border-b border-hairline flex items-center px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer">
            <LogoIcon size={18} variant="orange" />
            <span className="text-sm font-mono font-bold text-ink tracking-tight">Orflow</span>
          </Link>
          <span className="text-zinc-700 text-xs">/</span>
          <span className="text-xs font-mono text-ink font-semibold">Reconciliation Center</span>
        </div>
      </header>
      <div className="flex-1 p-4 sm:px-8 sm:pt-4 sm:pb-8">
        <div className="mb-5 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">Reconciliation Center</h1>
          <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
            Audit discrepancies between your internal records and Nomba provider data.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Select value={discrepancyType} onValueChange={(v) => { setDiscrepancyType(v as DiscrepancyType | ""); setPage(1) }}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {DISCREPANCY_TYPES.map(t => (
                <SelectItem key={t} value={t}>{DISCREPANCY_LABELS[t]}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={String(resolved)} onValueChange={(v) => { setResolved(v === "" ? "" : v === "true" ? true : false); setPage(1) }}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="false">Pending</SelectItem>
              <SelectItem value="true">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Run reference"
            value={runId}
            onChange={(e) => { setRunId(e.target.value); setPage(1) }}
            className="w-44 font-mono text-xs bg-canvas border border-hairline"
          />
        </div>

        {isLoading ? (
          <div className="border border-zinc-800 bg-zinc-950 p-8 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border border-hairline-strong border-t-transparent" />
          </div>
        ) : (
          <>
            <div className="hidden lg:flex gap-4 items-start">
              <div className="w-[60%] border border-zinc-800 bg-zinc-950 overflow-x-auto">
                <DiscrepancyTable
                  items={items}
                  activeId={activeId}
                  onSelect={selectDesktop}
                />
              </div>
              <div className="w-[40%] sticky top-4">
                <div className="border border-zinc-800 bg-zinc-950">
                  {activeItem ? (
                    <DiscrepancyDetailPanel
                      item={activeItem}
                      resolutionNote={resolutionNote}
                      onResolutionNoteChange={setResolutionNote}
                      onResolve={handleResolve}
                      isResolving={resolveMutation.isPending}
                    />
                  ) : (
                    <EmptyDetail />
                  )}
                </div>
              </div>
            </div>

            <div className="lg:hidden border border-zinc-800 bg-zinc-950 overflow-x-auto">
              <DiscrepancyTable
                items={items}
                activeId={activeId}
                onSelect={selectMobile}
              />
            </div>

            <div className="block md:hidden">
              <SlideOver open={mobileOpen} onClose={closeMobile}>
                {activeItem && (
                  <DiscrepancyDetailPanel
                    item={activeItem}
                    resolutionNote={resolutionNote}
                    onResolutionNoteChange={setResolutionNote}
                    onResolve={handleResolve}
                    isResolving={resolveMutation.isPending}
                    onClose={closeMobile}
                  />
                )}
              </SlideOver>
            </div>

            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-xs text-ink-soft">
                <span>{total} total discrepancies</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1.5 border border-hairline bg-paper text-ink-soft hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    Previous
                  </button>
                  <span className="font-mono">Page {page} of {totalPages}</span>
                  <button
                    type="button"
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1.5 border border-hairline bg-paper text-ink-soft hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}

/* ─── Discrepancy Data Table ────────────────────── */

function DiscrepancyTable({
  items,
  activeId,
  onSelect,
}: {
  items: ReconciliationDiscrepancy[]
  activeId: string | null
  onSelect: (d: ReconciliationDiscrepancy) => void
}) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <ShieldCheck size={24} className="text-zinc-700" />
        <p className="text-sm text-ink-soft">No discrepancies found</p>
      </div>
    )
  }

  return (
    <table className="w-full text-left text-sm">
      <colgroup>
        <col className="w-[13%]" />
        <col className="w-[14%]" />
        <col className="w-[12%]" />
        <col className="w-[28%]" />
        <col className="w-[16%]" />
        <col className="w-[17%]" />
      </colgroup>
      <thead>
        <tr className="border-b border-zinc-800 bg-zinc-900/50 text-xs font-medium text-ink-soft">
          <th className="px-4 py-3 font-medium">ID / Created</th>
          <th className="px-4 py-3 font-medium">Category</th>
          <th className="px-4 py-3 font-medium">Run</th>
          <th className="px-4 py-3 font-medium">Comparison</th>
          <th className="px-4 py-3 font-medium">Status</th>
          <th className="px-4 py-3 font-medium">Action</th>
        </tr>
      </thead>
      <tbody>
        {items.map(d => (
          <tr
            key={d.id}
            onClick={() => onSelect(d)}
            onKeyDown={(e) => { if (e.key === "Enter") onSelect(d) }}
            tabIndex={0}
            className={cn(
              "border-b border-zinc-800 last:border-0 transition-colors cursor-pointer",
              activeId === d.id ? "bg-primary/10" : "hover:bg-zinc-900/30",
            )}
          >
            <td className="px-4 py-3">
              <div className="font-mono text-xs text-ink">{d.id.slice(0, 8)}</div>
              <div className="text-[11px] text-ink-soft font-mono">
                {new Date(d.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
              </div>
            </td>
            <td className="px-4 py-3">
              <DiscrepancyBadge type={d.discrepancy_type} />
            </td>
            <td className="px-4 py-3">
              <span className="font-mono text-[11px] text-ink-soft">{d.run_id.slice(0, 8)}</span>
            </td>
            <td className="px-4 py-3">
              <div className="text-xs text-ink font-mono">
                <span className="text-ink-soft">Orflow:</span> {d.our_amount != null ? formatNaira(d.our_amount) : "—"}
                {" / "}
                <span className="text-ink-soft">Nomba:</span> {d.nomba_amount != null ? formatNaira(d.nomba_amount) : "—"}
              </div>
            </td>
            <td className="px-4 py-3">
              {d.resolved ? (
                <div className="flex items-center gap-1.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400 shrink-0">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  <span className="text-[11px] text-emerald-400 font-mono">
                    {d.resolved_at ? new Date(d.resolved_at).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : ""}
                  </span>
                </div>
              ) : (
                <span className="text-[11px] text-amber-400 font-medium">Pending</span>
              )}
            </td>
            <td className="px-4 py-3">
              {!d.resolved && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onSelect(d) }}
                  className="text-xs font-medium text-orange-500 hover:text-orange-400 transition-colors cursor-pointer"
                >
                  Review
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ─── Discrepancy Type Badge ───────────────────── */

const BADGE_STYLES: Record<DiscrepancyType, string> = {
  amount_mismatch: "border-orange-500/40 text-orange-400",
  status_mismatch: "border-red-500/40 text-red-400",
  missing_in_ours: "border-blue-500/40 text-blue-400",
  missing_in_nomba: "border-purple-500/40 text-purple-400",
}

function DiscrepancyBadge({ type }: { type: DiscrepancyType }) {
  return (
    <span className={cn(
      "inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 border leading-none select-none",
      BADGE_STYLES[type],
    )}>
      {type === "amount_mismatch" ? "Amount" :
       type === "status_mismatch" ? "Status" :
       type === "missing_in_ours" ? "Ours" :
       type === "missing_in_nomba" ? "Nomba" : type}
    </span>
  )
}

/* ─── Empty Detail State ────────────────────────── */

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
      <p className="mt-4 text-sm text-ink-soft font-medium">Select a discrepancy</p>
      <p className="mt-1 text-xs text-zinc-600 max-w-[200px]">Choose a row from the table to view full details and resolve.</p>
    </div>
  )
}

/* ─── Detail Panel / Drawer Content ────────────── */

function DiscrepancyDetailPanel({
  item,
  resolutionNote,
  onResolutionNoteChange,
  onResolve,
  isResolving,
  onClose,
}: {
  item: ReconciliationDiscrepancy
  resolutionNote: string
  onResolutionNoteChange: (v: string) => void
  onResolve: () => void
  isResolving: boolean
  onClose?: () => void
}) {
  function fmt(v: string | null | undefined) {
    return v ?? "—"
  }

  return (
    <div className="flex flex-col">
      <div className="border-b border-zinc-800 px-5 py-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-ink tracking-tight">Discrepancy Details</h2>
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

      <div className="px-5 py-4 space-y-5 overflow-y-auto">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-3">Discrepancy</p>
          <div className="space-y-2.5">
            <DetailRow label="Type" value={DISCREPANCY_LABELS[item.discrepancy_type]} />
            <DetailRow label="ID" value={item.id} mono />
            <DetailRow label="Run ID" value={fmt(item.run_id)} mono />
            <DetailRow label="Created" value={new Date(item.created_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
            <DetailRow label="Status" value={item.resolved ? "Resolved" : "Pending"} />
            {item.resolved_at && (
              <DetailRow label="Resolved at" value={new Date(item.resolved_at).toLocaleString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
            )}
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-3">Comparison</p>
          <div className="border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800">
            <CompareRow label="Status" ours={fmt(item.our_status)} nomba={fmt(item.nomba_status)} />
            <CompareRow label="Amount" ours={item.our_amount != null ? formatNaira(item.our_amount) : "—"} nomba={item.nomba_amount != null ? formatNaira(item.nomba_amount) : "—"} />
            <CompareRow label="Tx Ref" ours={fmt(item.merchant_tx_ref)} nomba={fmt(item.nomba_transaction_id)} />
            <CompareRow label="Payment Attempt ID" ours={fmt(item.payment_attempt_id ? item.payment_attempt_id.slice(0, 8) : null)} nomba={fmt(item.nomba_transaction_id ? item.nomba_transaction_id.slice(0, 8) : null)} />
            <CompareRow label="Invoice ID" ours={fmt(item.invoice_id ? item.invoice_id.slice(0, 8) : null)} nomba={"—"} />
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-3">Internal vs Nomba Payload</p>
          <div className="border border-zinc-800 bg-zinc-900/50 divide-y divide-zinc-800">
            <div className="grid grid-cols-3 gap-2 px-3 py-2">
              <span className="text-[11px] text-ink-soft font-medium">Field</span>
              <span className="text-[11px] text-ink-soft font-medium">Orflow</span>
              <span className="text-[11px] text-ink-soft font-medium">Nomba</span>
            </div>
            <CompareRow label="merchant_tx_ref" ours={fmt(item.merchant_tx_ref)} nomba={fmt(item.nomba_transaction_id)} />
            <CompareRow label="payment_attempt_id" ours={fmt(item.payment_attempt_id)} nomba={"—"} />
            <CompareRow label="invoice_id" ours={fmt(item.invoice_id)} nomba={"—"} />
          </div>
        </div>

        {!item.resolved && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-soft mb-3">Resolution</p>
            <textarea
              value={resolutionNote}
              onChange={(e) => onResolutionNoteChange(e.target.value)}
              placeholder="Agent resolution note..."
              rows={3}
              className="bg-zinc-900 border-zinc-800 rounded-none w-full text-sm placeholder:text-zinc-600 text-ink px-3 py-2 resize-none focus:outline-none focus:border-zinc-700 transition-colors"
            />
            <button
              type="button"
              onClick={onResolve}
              disabled={isResolving}
              className="mt-3 bg-orange-600 hover:bg-orange-500 text-zinc-50 rounded-none text-sm font-medium px-4 py-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isResolving ? "Resolving..." : "Execute Manual Resolution"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function CompareRow({ label, ours, nomba }: { label: string; ours: string; nomba: string }) {
  return (
    <div className="grid grid-cols-3 gap-2 px-3 py-2 text-[11px]">
      <span className="text-ink-soft font-mono">{label}</span>
      <span className="text-ink font-mono truncate">{ours}</span>
      <span className="text-ink font-mono truncate">{nomba}</span>
    </div>
  )
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string
  value: string
  mono?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-xs text-ink-soft shrink-0">{label}</span>
      <span className={cn("text-xs text-ink text-right", mono && "font-mono")}>
        {value}
      </span>
    </div>
  )
}

/* ─── Mobile Slide-Over ─────────────────────────── */

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
            "fixed inset-y-0 right-0 z-[70] w-full max-w-md border-l border-zinc-800 bg-paper shadow-xl",
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
