import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { Subscription, AuditLogEntry } from "@/api/types/subscriptions"

export function useSubscriptions(projectId: string) {
  return useQuery({
    queryKey: ["subscriptions", projectId],
    queryFn: () =>
      apiClient.get<Subscription[]>(
        ENDPOINTS.SUBSCRIPTIONS.LIST,
        { params: { projectId } },
      ).then(res => res.data.map(mapSubscription)),
  })
}

export function useSubscriptionAuditLog(subscriptionId: string | null) {
  return useQuery({
    queryKey: ["subscription-audit-log", subscriptionId],
    queryFn: () =>
      apiClient.get<AuditLogEntry[]>(
        ENDPOINTS.SUBSCRIPTIONS.AUDIT_LOG(subscriptionId!),
      ).then(res => res.data),
    enabled: !!subscriptionId,
  })
}

function mapSubscription(raw: any): Subscription {
  return {
    ...raw,
    plan_name: raw.plan?.name ?? raw.plan_name,
    customer_email: raw.customer?.email ?? raw.customer_email,
    customer_name: raw.customer?.name ?? raw.customer_name,
    amount: raw.plan?.amount ?? raw.amount,
    currency: raw.plan?.currency ?? raw.currency,
  }
}

export function useCancelSubscription(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (subscriptionId: string) =>
      apiClient.post(ENDPOINTS.SUBSCRIPTIONS.CANCEL(subscriptionId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", projectId] })
    },
  })
}

export function usePauseSubscription(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (subscriptionId: string) =>
      apiClient.post(ENDPOINTS.SUBSCRIPTIONS.PAUSE(subscriptionId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", projectId] })
    },
  })
}

export function useResumeSubscription(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (subscriptionId: string) =>
      apiClient.post(ENDPOINTS.SUBSCRIPTIONS.RESUME(subscriptionId)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", projectId] })
    },
  })
}
