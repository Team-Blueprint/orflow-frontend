import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "@tanstack/react-router"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { formatNaira } from "@/lib/currency"
import { useDocumentTitle } from "@/hooks/useDocumentTitle"
import { SubscriptionPagesList } from "@/components/plans/SubscriptionPagesList"

interface Plan {
  id: string
  name: string
  amount: number
  currency: string
  interval: string
  interval_count: number
  trial_period_days: number | null
  installments_count: number | null
  subscription_count: number
  revenue: number
  status: "active" | "archived"
  created_at: string
}

interface PlanSubscription {
  id: string
  customer_id: string
  customer_name: string
  customer_email: string
  status: string
  amount: number
  created_at: string
}

const SUB_STATUS_BADGE: Record<string, "success" | "destructive" | "muted" | "info"> = {
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

function mapPlanSub(raw: any): PlanSubscription {
  return {
    id: raw.id,
    customer_id: raw.customer_id,
    customer_name: raw.customer?.name ?? raw.customer_name ?? "",
    customer_email: raw.customer?.email ?? raw.customer_email ?? "",
    status: raw.status,
    amount: raw.plan?.amount ?? raw.amount,
    created_at: raw.created_at,
  }
}

export function PlanDetailPage() {
  const { planId, projectId } = useParams({ from: "/dashboard/$projectId/plans/$planId" })
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data: plan, isLoading: isPlanLoading } = useQuery<Plan>({
    queryKey: ["plan", planId],
    queryFn: () => apiClient.get(ENDPOINTS.PLANS.GET(planId)).then(res => res.data),
  })

  useDocumentTitle(plan ? `${plan.name} | Orflow` : "Plans | Orflow")

  const { data: subscriptions = [], isLoading: isSubscriptionsLoading } = useQuery<PlanSubscription[]>({
    queryKey: ["plan-subscriptions", planId],
    queryFn: () => apiClient.get<any[]>(
      ENDPOINTS.SUBSCRIPTIONS.LIST,
      { params: { plan_id: planId, limit: 5, offset: 0 } },
    ).then(res => res.data.map(mapPlanSub)),
    enabled: !!planId,
  })

  const [name, setName] = useState("")
  const [trialPeriodDays, setTrialPeriodDays] = useState<string>("")
  const [installmentsCount, setInstallmentsCount] = useState<string>("")

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

  const isSaving = updateMutation.isPending || archiveMutation.isPending
  const displayedSubs = subscriptions.slice(0, 5)

  if (isPlanLoading) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="h-8 bg-zinc-800 animate-pulse w-48 mb-4" />
        <div className="h-4 bg-zinc-800 animate-pulse w-32 mb-8" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-64 bg-zinc-800 animate-pulse" />
          <div className="h-64 bg-zinc-800 animate-pulse" />
        </div>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-center text-ink-soft">Plan not found</p>
        <div className="mt-6 flex justify-center">
          <Link
            to={`/dashboard/${projectId}/plans` as any}
            className="text-sm text-primary hover:text-primary-hover transition-colors"
          >
            &larr; Back to Plans
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="flex flex-col gap-5 sm:gap-6">
        {/* Header */}
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
              {formatNaira(plan.amount)} / {plan.interval}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-xs text-ink-soft">{plan.subscription_count} subscriptions</span>
              <span className="text-xs text-ink-soft">{formatNaira(plan.revenue)} revenue</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Badge variant={plan.status === "active" ? "default" : "secondary"} className="capitalize">
              {plan.status}
            </Badge>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left: Configuration */}
          <div className="lg:w-[40%] flex flex-col gap-8">
            <div className="border border-hairline bg-paper p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-ink mb-6">Configuration</h2>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label htmlFor="plan-name" className="text-sm font-medium text-ink mb-1">Plan name</label>
                  <Input
                    id="plan-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Basic Monthly"
                    className="bg-canvas border border-hairline focus:border-hilight-strong"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="trial-period" className="text-sm font-medium text-ink mb-1">Trial period (days)</label>
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
                <div className="flex flex-col gap-2">
                  <label htmlFor="max-payments" className="text-sm font-medium text-ink mb-1">Max payments</label>
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
              <div className="mt-6 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => archiveMutation.mutate()}
                  disabled={isSaving}
                  className="bg-red-950/40 border border-red-900/50 text-red-400 px-4 py-2 hover:bg-red-950/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Archive plan
                </button>
              </div>
            </div>
          </div>

          {/* Right: Subscriptions + Payment Link */}
          <div className="lg:w-[60%] flex flex-col gap-6">
            {/* Recent Subscriptions */}
            <div className="border border-hairline bg-paper">
              <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
                <h3 className="text-sm font-semibold text-ink">Recent Subscriptions</h3>
              </div>
              {isSubscriptionsLoading ? (
                <div className="flex flex-col p-4 gap-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-10 bg-zinc-800 animate-pulse" />
                  ))}
                </div>
              ) : displayedSubs.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
                  <p className="text-sm text-ink-soft">No subscriptions yet</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="hidden lg:block overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <colgroup>
                        <col className="w-[28%]" />
                        <col className="w-[22%]" />
                        <col className="w-[20%]" />
                        <col className="w-[30%]" />
                      </colgroup>
                      <thead>
                        <tr className="border-b border-hairline bg-midnight-soft text-xs font-medium text-ink-soft">
                          <th className="px-4 py-3 font-medium">Customer</th>
                          <th className="px-4 py-3 font-medium">Status</th>
                          <th className="px-4 py-3 font-medium">Amount</th>
                          <th className="px-4 py-3 font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedSubs.map((sub) => (
                          <tr key={sub.id} className="border-b border-hairline last:border-0 transition-colors hover:bg-midnight-soft/30">
                            <td className="px-4 py-3">
                              <div className="text-sm font-medium text-ink">{sub.customer_name}</div>
                              <div className="text-[11px] text-ink-soft truncate">{sub.customer_email}</div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant={SUB_STATUS_BADGE[sub.status] ?? "muted"}
                                className="capitalize text-xs"
                              >
                                {sub.status === "past_due" ? "Past Due" : sub.status === "incomplete_expired" ? "Expired" : sub.status}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-xs text-ink-soft font-mono">
                              {formatNaira(sub.amount ?? 0)}
                            </td>
                            <td className="px-4 py-3 text-xs text-ink-soft font-mono">
                              {new Date(sub.created_at).toLocaleDateString("en-US", {
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
                  <div className="flex flex-col gap-2 lg:hidden p-4">
                    {displayedSubs.map((sub) => (
                      <div key={sub.id} className="border border-hairline bg-midnight-soft p-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="text-sm font-medium text-ink">{sub.customer_name}</div>
                            <div className="text-[11px] text-ink-soft truncate mt-0.5">{sub.customer_email}</div>
                          </div>
                          <Badge
                            variant={SUB_STATUS_BADGE[sub.status] ?? "muted"}
                            className="shrink-0 capitalize text-xs"
                          >
                            {sub.status === "past_due" ? "Past Due" : sub.status === "incomplete_expired" ? "Expired" : sub.status}
                          </Badge>
                        </div>
                        <div className="mt-1 flex items-center gap-3 text-xs text-ink-soft">
                          <span className="font-mono">{formatNaira(sub.amount ?? 0)}</span>
                          <span className="font-mono">
                            {new Date(sub.created_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* See all link */}
                  <div className="border-t border-hairline px-4 py-3">
                    <Link
                      to="/dashboard/$projectId/subscriptions"
                      params={{ projectId } as any}
                      className="text-xs font-medium text-primary hover:text-primary-hover transition-colors cursor-pointer"
                    >
                      &rarr; See all subscriptions ({subscriptions.length})
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Subscription Pages Widget */}
            <SubscriptionPagesList planId={planId} projectId={projectId} />
          </div>
        </div>
      </div>
    </div>
  )
}
