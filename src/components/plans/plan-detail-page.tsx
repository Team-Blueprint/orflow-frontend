import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PlanDetailSkeleton } from "@/components/skeletons/plan-detail-skeleton"

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

interface Subscription {
  id: string
  customer_email: string
  status: "active" | "past_due" | "canceled"
  amount: number
  started_at: string
  next_billing_date?: string
}

interface Subscriber {
  email: string
  plan: string
  activity_status: "active" | "inactive" | "suspended"
  last_seen: string
}

interface PaymentLink {
  id: string
  url: string
  plan_name: string
  status?: "active" | "expired"
  total_visits?: number
}

export function PlanDetailPage() {
  const { planId } = useParams({ from: "/dashboard/$projectId/plans/$planId" })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: plan, isLoading: isPlanLoading } = useQuery<Plan>({
    queryKey: ["plan", planId],
    queryFn: () => apiClient.get(ENDPOINTS.PLANS.GET(planId)).then(res => res.data),
  })

  const { data: subscriptions = [], isLoading: isSubscriptionsLoading } = useQuery<Subscription[]> ({
    queryKey: ["subscriptions", planId],
    queryFn: () => apiClient.get(`/v1/subscriptions/plan/${planId}`).then(res => res.data),
    enabled: !!planId,
  })

  const { data: paymentLinks = [] } = useQuery<PaymentLink[]> ({
    queryKey: ["paymentLinks", planId],
    queryFn: () => apiClient.get(`/v1/plans/${planId}/payment-links`).then(res => res.data),
    enabled: !!planId,
  })

  const [name, setName] = useState("")
  const [trialPeriodDays, setTrialPeriodDays] = useState<string>("")
  const [installmentsCount, setInstallmentsCount] = useState<string>("")
  const [activeTab, setActiveTab] = useState("subscriptions")

  useEffect(() => {
    if (plan) {
      setName(plan.name)
      setTrialPeriodDays(plan.trial_period_days?.toString() || "")
      setInstallmentsCount(plan.installments_count?.toString() || "")
    }
  }, [plan])

  const updateMutation = useMutation({
    mutationFn: (data: Partial<Plan>) => apiClient.patch(ENDPOINTS.PLANS.UPDATE(planId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] })
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })

  const archiveMutation = useMutation({
    mutationFn: () => apiClient.post(ENDPOINTS.PLANS.ARCHIVE(planId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plan", planId] })
      queryClient.invalidateQueries({ queryKey: ["plans"] })
    },
  })

  const handleSave = () => {
    updateMutation.mutate({
      name,
      trial_period_days: trialPeriodDays ? parseInt(trialPeriodDays, 10) : null,
      installments_count: installmentsCount ? parseInt(installmentsCount, 10) : null,
    })
  }

  if (isPlanLoading) {
    return <PlanDetailSkeleton />
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-center text-ink-soft">Plan not found</p>
        <div className="mt-6 flex justify-center">
          <Link
            to={"/dashboard/$projectId" as any}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  const isSaving = updateMutation.isPending || archiveMutation.isPending

  return (
    <div className="mx-auto max-w-7xl p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Plan Details Header Section */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => navigate({ to: "/dashboard/$projectId/plans" as any })}
              className="flex items-center gap-2 text-sm text-ink-soft hover:text-ink transition-colors cursor-pointer -mt-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              <span className="text-xs">Back to Plans</span>
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink tracking-tight">{plan.name}</h1>
            <p className="text-xs sm:text-sm text-ink-soft mt-1 sm:mt-1.5">
              Manage your {plan.interval} pricing tier for this workspace.
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant={plan.status === "active" ? "default" : "secondary"} className="capitalize">
              {plan.status}
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Control Panel - 40% Width */}
          <div className="lg:w-[40%] flex flex-col gap-8">
            <div className="border border-hairline bg-paper p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-ink mb-6">Configuration</h2>

              <div className="flex flex-col gap-6">
                {/* Name */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="plan-name" className="text-sm font-medium text-ink mb-1">
                    Plan name
                  </label>
                  <Input
                    id="plan-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Basic Monthly"
                    className="bg-canvas border border-hairline focus:border-hilight-strong"
                  />
                </div>

                {/* Trial Period */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="trial-period" className="text-sm font-medium text-ink mb-1">
                    Trial period (days)
                  </label>
                  <Input
                    id="trial-period"
                    type="number"
                    min="0"
                    value={trialPeriodDays}
                    onChange={(e) => setTrialPeriodDays(e.target.value)}
                    placeholder="7"
                    className="bg-canvas border border-hairline focus:border-hilight-strong"
                  />
                </div>

                {/* Max Payments */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="max-payments" className="text-sm font-medium text-ink mb-1">
                    Max payments
                  </label>
                  <Input
                    id="max-payments"
                    type="number"
                    min="0"
                    value={installmentsCount}
                    onChange={(e) => setInstallmentsCount(e.target.value)}
                    placeholder="12"
                    className="bg-canvas border border-hairline focus:border-hilight-strong"
                  />
                </div>
              </div>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => archiveMutation.mutate()}
                  disabled={isSaving}
                  className="bg-red-950/40 border border-red-900/50 text-red-400 px-6 py-3 hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Archive plan
                </button>
              </div>
            </div>
          </div>

          {/* Right Telemetry Deck - 60% Width */}
          <div className="lg:w-[60%] flex flex-col gap-6">
            {/* Tabs */}
            <div className="flex border-b border-hairline">
              {[
                { id: "subscriptions", label: "Subscriptions" },
                { id: "subscribers", label: "Subscribers" },
                { id: "payment-links", label: "Payment Links" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-sm font-medium transition-colors cursor-pointer border-b-2 ${activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-ink-soft hover:text-ink hover:bg-paper/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 border border-hairline bg-paper">
              {isSubscriptionsLoading && activeTab === "subscriptions" ? (
                <div className="flex gap-4 p-6">
                  <div className="h-12 w-32 bg-zinc-800 animate-pulse" />
                  <div className="h-12 w-32 bg-zinc-900/50 animate-pulse" />
                  <div className="h-12 w-32 bg-zinc-800 animate-pulse" />
                </div>
              ) : (
                <>
                  {activeTab === "subscriptions" && (
                    <SubscriptionsTable subscriptions={subscriptions} />
                  )}

                  {activeTab === "subscribers" && (
                    <SubscribersTable planName={plan.name} />
                  )}

                  {activeTab === "payment-links" && (
                    <PaymentLinksTable links={paymentLinks} planId={planId} />
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SubscriptionsTable({ subscriptions }: { subscriptions: Subscription[] }) {
  if (subscriptions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
          <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        <p className="text-sm text-ink-soft">No active subscriptions</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[30%]" />
            <col className="w-[18%]" />
            <col className="w-[24%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-hairline bg-midnight-soft text-xs font-medium text-ink-soft">
              <th className="px-4 py-3 font-medium">Subscription ID</th>
              <th className="px-4 py-3 font-medium">Customer Email</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Next Billing Date</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((sub) => (
              <tr key={sub.id} className="border-b border-hairline last:border-0 transition-colors hover:bg-midnight-soft/30">
                <td className="px-4 py-3 font-mono text-xs text-ink-soft">{sub.id}</td>
                <td className="px-4 py-3 text-ink">{sub.customer_email}</td>
                <td className="px-4 py-3">
                  <Badge variant={sub.status === "active" ? "success" : sub.status === "past_due" ? "destructive" : "muted"} className="capitalize text-xs">
                    {sub.status === "active" ? "Active" : sub.status === "past_due" ? "Past Due" : "Canceled"}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft font-mono">
                  {sub.next_billing_date
                    ? new Date(sub.next_billing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : new Date(sub.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden p-4">
        {subscriptions.map((sub) => (
          <div key={sub.id} className="border border-hairline bg-paper p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-medium text-ink truncate">{sub.customer_email}</div>
              <Badge variant={sub.status === "active" ? "success" : sub.status === "past_due" ? "destructive" : "muted"} className="shrink-0 capitalize text-xs">
                {sub.status === "active" ? "Active" : sub.status === "past_due" ? "Past Due" : "Canceled"}
              </Badge>
            </div>
            <div className="mt-2 text-[11px] font-mono text-ink-soft">ID: {sub.id}</div>
            <div className="mt-1 text-[11px] text-ink-soft">
              Next billing: {sub.next_billing_date
                ? new Date(sub.next_billing_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : new Date(sub.started_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function SubscribersTable({ planName }: { planName: string }) {
  const subscribers: Subscriber[] = [
    { email: "alice@example.com", plan: planName, activity_status: "active", last_seen: "2026-06-28T14:30:00Z" },
    { email: "bob@example.com", plan: planName, activity_status: "active", last_seen: "2026-06-25T09:15:00Z" },
    { email: "carol@example.com", plan: planName, activity_status: "inactive", last_seen: "2026-05-10T11:00:00Z" },
    { email: "dave@example.com", plan: planName, activity_status: "active", last_seen: "2026-07-01T16:45:00Z" },
    { email: "eve@example.com", plan: planName, activity_status: "suspended", last_seen: "2026-04-20T08:00:00Z" },
  ]

  if (subscribers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <p className="text-sm text-ink-soft">No subscribers yet</p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-sm">
          <colgroup>
            <col className="w-[30%]" />
            <col className="w-[22%]" />
            <col className="w-[18%]" />
            <col className="w-[30%]" />
          </colgroup>
          <thead>
            <tr className="border-b border-hairline bg-midnight-soft text-xs font-medium text-ink-soft">
              <th className="px-4 py-3 font-medium">Email Address</th>
              <th className="px-4 py-3 font-medium">Enrolled Plan</th>
              <th className="px-4 py-3 font-medium">Activity Status</th>
              <th className="px-4 py-3 font-medium">Last Seen</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((s, i) => (
              <tr key={i} className="border-b border-hairline last:border-0 transition-colors hover:bg-midnight-soft/30">
                <td className="px-4 py-3 text-ink">{s.email}</td>
                <td className="px-4 py-3 text-sm text-ink-soft">{s.plan}</td>
                <td className="px-4 py-3">
                  <Badge variant={s.activity_status === "active" ? "success" : s.activity_status === "suspended" ? "destructive" : "muted"} className="capitalize text-xs">
                    {s.activity_status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-xs text-ink-soft font-mono">
                  {new Date(s.last_seen).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 lg:hidden p-4">
        {subscribers.map((s, i) => (
          <div key={i} className="border border-hairline bg-paper p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="text-sm font-medium text-ink truncate">{s.email}</div>
              <Badge variant={s.activity_status === "active" ? "success" : s.activity_status === "suspended" ? "destructive" : "muted"} className="shrink-0 capitalize text-xs">
                {s.activity_status}
              </Badge>
            </div>
            <div className="mt-2 text-[11px] text-ink-soft">Plan: {s.plan}</div>
            <div className="mt-1 text-[11px] text-ink-soft">
              Last seen: {new Date(s.last_seen).toLocaleDateString("en-US", {
                month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

function PaymentLinksTable({ links, planId: _planId }: { links: PaymentLink[]; planId: string }) {
  return (
    <div>
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <h3 className="text-sm font-medium text-ink">Quick Checkout Links</h3>
        <button
          type="button"
          onClick={() => {
            // Handle create payment link
          }}
          className="bg-primary text-white hover:bg-primary-hover text-xs font-bold px-4 py-2 cursor-pointer"
        >
          + Create Payment Link
        </button>
      </div>
      {links.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-700">
            <path d="M12 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2 2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z" />
            <path d="M8 9h8" /><path d="M8 13h8" /><path d="M8 17h8" />
          </svg>
          <p className="text-sm text-ink-soft">No payment links generated yet</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm">
              <colgroup>
                <col className="w-[25%]" />
                <col className="w-[35%]" />
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[10%]" />
              </colgroup>
              <thead>
                <tr className="border-b border-hairline bg-midnight-soft text-xs font-medium text-ink-soft">
                  <th className="px-4 py-3 font-medium">Link Name</th>
                  <th className="px-4 py-3 font-medium">URL / Path</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Total Visits</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {links.map((link) => (
                  <tr key={link.id} className="border-b border-hairline last:border-0 transition-colors hover:bg-midnight-soft/30">
                    <td className="px-4 py-3 text-sm font-medium text-ink">{link.plan_name}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <code className="font-mono text-xs text-ink-soft truncate max-w-[200px]">
                          /pay/{link.id}
                        </code>
                        <button
                          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/pay/${link.id}`)}
                          className="shrink-0 text-ink-soft hover:text-ink transition-colors cursor-pointer"
                          aria-label="Copy link"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                            <path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={(link.status ?? "active") === "active" ? "success" : "muted"} className="capitalize text-xs">
                        {link.status ?? "Active"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-soft font-mono">{link.total_visits ?? 0}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => window.open(`${window.location.origin}/pay/${link.id}`, "_blank")}
                        className="text-xs text-ink-soft hover:text-primary transition-colors cursor-pointer"
                      >
                        Open
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="flex flex-col gap-3 lg:hidden p-4">
            {links.map((link) => (
              <div key={link.id} className="border border-hairline bg-paper p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-sm font-medium text-ink truncate">{link.plan_name}</div>
                  <Badge variant={(link.status ?? "active") === "active" ? "success" : "muted"} className="shrink-0 capitalize text-xs">
                    {link.status ?? "Active"}
                  </Badge>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <code className="font-mono text-[11px] text-ink-soft truncate flex-1">/pay/{link.id}</code>
                  <button
                    onClick={() => navigator.clipboard.writeText(`${window.location.origin}/pay/${link.id}`)}
                    className="shrink-0 text-ink-soft hover:text-ink transition-colors cursor-pointer"
                    aria-label="Copy link"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                      <path d="M4 10a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10z" />
                    </svg>
                  </button>
                </div>
                <div className="mt-1 flex items-center justify-between text-[11px] text-ink-soft">
                  <span>{link.total_visits ?? 0} visits</span>
                  <button
                    onClick={() => window.open(`${window.location.origin}/pay/${link.id}`, "_blank")}
                    className="text-ink-soft hover:text-primary transition-colors cursor-pointer"
                  >
                    Open →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}