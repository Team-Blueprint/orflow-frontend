import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import type { PortalSubscriptionRead, PortalPaymentRead, SubscriptionPageData } from "./portal-data"
import type { PublicPageInfo, PublicCheckoutResponse } from "@/api/types/subscription-pages"


export const queryKeys = {
  portal: {
    subscription: ["portal", "subscription"] as const,
    payments: ["portal", "payments"] as const,
  },
  subscriptionPage: {
    byCode: (code: string) => ["subscriptionPage", code] as const,
  },
}

export function usePortalSubscription() {
  return useQuery({
    queryKey: queryKeys.portal.subscription,
    queryFn: async (): Promise<PortalSubscriptionRead | null> => {
      try {
        const res = await apiClient.get<PortalSubscriptionRead>(
          "/v1/portal/subscriptions/me",
        )
        return res.data
      } catch {
        return null
      }
    },
    retry: false,
  })
}

export function usePortalBillingHistory() {
  return useQuery({
    queryKey: queryKeys.portal.payments,
    queryFn: async (): Promise<PortalPaymentRead[]> => {
      const res = await apiClient.get<PortalPaymentRead[]>(
        "/v1/portal/subscriptions/me/payments",
      )
      return res.data
    },
    retry: false,
  })
}

export function useUpdatePortalCard() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: {
      payment_token: string
      card_brand?: string
      card_last4?: string
    }) => {
      await apiClient.post("/v1/portal/subscriptions/update-card", input)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portal.subscription })
    },
  })
}

export function useCancelPortalSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/v1/portal/subscriptions/cancel")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portal.subscription })
    },
  })
}

export function usePausePortalSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/v1/portal/subscriptions/pause")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portal.subscription })
    },
  })
}

export function useResumePortalSubscription() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      await apiClient.post("/v1/portal/subscriptions/resume")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.portal.subscription })
    },
  })
}

export function useUpdatePortalPin() {
  return useMutation({
    mutationFn: async (input: { current_pin: string; new_pin: string }) => {
      await apiClient.post("/v1/portal/update-pin", input)
    },
  })
}

function mapPublicPageInfo(raw: PublicPageInfo): SubscriptionPageData {
  return {
    code: raw.id,
    is_test: raw.is_test,
    plan: {
      id: raw.plan_id,
      projectId: "",
      name: raw.name,
      description: "",
      amount: raw.amount * 100,
      currency: raw.currency,
      interval: raw.interval,
    },
    merchant: {
      name: raw.project_name,
    },
  }
}

export function useSubscriptionPage(code: string) {
  return useQuery({
    queryKey: queryKeys.subscriptionPage.byCode(code),
    queryFn: async (): Promise<SubscriptionPageData | null> => {
      const res = await apiClient.get<PublicPageInfo>(
        `/v1/subscription-pages/code/${code}`,
      )
      return mapPublicPageInfo(res.data)
    },
  })
}

export function useCreatePortalSubscription(code: string) {
  return useMutation({
    mutationFn: async (input: { name: string; email: string }) => {
      const res = await apiClient.post<PublicCheckoutResponse>(
        `/v1/subscription-pages/code/${code}/checkout`,
        { name: input.name, email: input.email },
      )
      return { checkoutLink: res.data.checkout_link, orderReference: res.data.order_reference }
    },
  })
}

export function usePortalAccessInfo(tokenSlug: string) {
  return useQuery({
    queryKey: ["portal", "access-info", tokenSlug],
    queryFn: async () => {
      const res = await apiClient.get<{ name: string }>(
        `/v1/portal/access/${tokenSlug}`,
      )
      return res.data
    },
    retry: false,
  })
}

export function usePortalVerifyAccess() {
  return useMutation({
    mutationFn: async (input: { token_slug: string; pin: string }) => {
      const res = await apiClient.post<{ portal_session_token: string }>(
        "/v1/portal/verify-access",
        input,
      )
      return res.data.portal_session_token
    },
  })
}
