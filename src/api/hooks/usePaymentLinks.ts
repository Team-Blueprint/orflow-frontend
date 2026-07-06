import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"

export interface PaymentLink {
  id: string
  plan_id: string
  url: string
  created_at: string
}

const IS_MOCK_MODE = true

let mockLink: PaymentLink | null = null

export function usePaymentLink(projectId: string, planId: string) {
  return useQuery({
    queryKey: ["payment-link", projectId, planId],
    queryFn: async (): Promise<PaymentLink | null> => {
      if (IS_MOCK_MODE) {
        return mockLink
      }
      try {
        const response = await apiClient.get<PaymentLink>(
          `/v1/payment-links/${planId}`,
        )
        return response.data
      } catch {
        return null
      }
    },
  })
}

export function useGeneratePaymentLink(projectId: string, planId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<PaymentLink> => {
      if (IS_MOCK_MODE) {
        const link: PaymentLink = {
          id: `pl_${Math.random().toString(36).slice(2, 10)}`,
          plan_id: planId,
          url: `${window.location.origin}/subscribe/${Math.random().toString(36).slice(2, 10)}`,
          created_at: new Date().toISOString(),
        }
        mockLink = link
        return link
      }
      const response = await apiClient.post<PaymentLink>(
        `/v1/payment-links/generate`,
        { plan_id: planId },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-link", projectId, planId] })
    },
  })
}

export function useRegeneratePaymentLink(projectId: string, planId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (): Promise<PaymentLink> => {
      if (IS_MOCK_MODE) {
        const link: PaymentLink = {
          id: `pl_${Math.random().toString(36).slice(2, 10)}`,
          plan_id: planId,
          url: `${window.location.origin}/subscribe/${Math.random().toString(36).slice(2, 10)}`,
          created_at: new Date().toISOString(),
        }
        mockLink = link
        return link
      }
      const response = await apiClient.post<PaymentLink>(
        `/v1/payment-links/regenerate`,
        { plan_id: planId },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-link", projectId, planId] })
    },
  })
}
