import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { PaymentLink } from "@/api/types/payment-links"

const IS_MOCK_MODE = true

const PLAN_NAMES = ["Starter Monthly", "Pro Monthly", "Enterprise Yearly", "Basic Quarterly", "Premium Weekly"]

function seedRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)]
}

let mockLinks: PaymentLink[] = []

function generateMockLinks(planId: string): PaymentLink[] {
  const rng = seedRandom(55)
  const now = new Date()

  return Array.from({ length: 6 }, (_, i) => {
    const daysAgo = Math.floor(rng() * 90)
    const createdDate = new Date(now)
    createdDate.setDate(createdDate.getDate() - daysAgo)
    return {
      id: `pl_${String(i + 1).padStart(3, "0")}`,
      plan_id: planId,
      plan_name: pick(PLAN_NAMES, rng),
      slug: `checkout_orflow_${Math.random().toString(36).slice(2, 10)}`,
      url: `/pay/pl_${String(i + 1).padStart(3, "0")}`,
      status: rng() > 0.2 ? "active" : "expired",
      total_visits: Math.floor(rng() * 500),
      created_at: createdDate.toISOString(),
      updated_at: createdDate.toISOString(),
    }
  })
}

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms))
}

export function usePaymentLinks(projectId: string, planId: string) {
  return useQuery({
    queryKey: ["payment-links", projectId, planId],
    queryFn: async () => {
      if (IS_MOCK_MODE) {
        await delay()
        if (mockLinks.length === 0) {
          mockLinks = generateMockLinks(planId)
        }
        return mockLinks
      }
      const response = await apiClient.get<PaymentLink[]>(
        ENDPOINTS.PAYMENT_LINKS.LIST,
        { params: { projectId, plan_id: planId } },
      )
      return response.data
    },
  })
}

export function useCreatePaymentLink(projectId: string, planId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { plan_name?: string }) => {
      if (IS_MOCK_MODE) {
        await delay(300)
        const slug = `checkout_orflow_${Math.random().toString(36).slice(2, 10)}`
        const newLink: PaymentLink = {
          id: `pl_${String(mockLinks.length + 1).padStart(3, "0")}`,
          plan_id: planId,
          plan_name: data.plan_name ?? PLAN_NAMES[0],
          slug,
          url: `/pay/pl_${String(mockLinks.length + 1).padStart(3, "0")}`,
          status: "active",
          total_visits: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        mockLinks = [newLink, ...mockLinks]
        return newLink
      }
      const response = await apiClient.post<PaymentLink>(
        ENDPOINTS.PAYMENT_LINKS.CREATE,
        { plan_id: planId, ...data },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-links", projectId, planId] })
    },
  })
}

export function useDeletePaymentLink(projectId: string, planId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (linkId: string) => {
      if (IS_MOCK_MODE) {
        await delay(300)
        mockLinks = mockLinks.filter((l) => l.id !== linkId)
        return
      }
      await apiClient.delete(ENDPOINTS.PAYMENT_LINKS.DELETE(linkId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-links", projectId, planId] })
    },
  })
}
