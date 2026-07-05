import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { Subscription } from "@/api/types/subscriptions"

const IS_MOCK_MODE = true

const PLANS = ["Starter Monthly", "Pro Monthly", "Enterprise Yearly", "Basic Quarterly", "Premium Weekly"]
const FIRST_NAMES = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank", "Iris", "Jack"]
const LAST_NAMES = ["Johnson", "Smith", "Brown", "Williams", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Lee"]
const INTERVALS = ["monthly", "yearly", "weekly", "quarterly"]
const DOMAINS = ["gmail.com", "outlook.com", "example.com", "acme.co", "startup.io"]

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

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function generateMockSubscriptions(): Subscription[] {
  const rng = seedRandom(99)
  const now = new Date()
  const statuses: Subscription["status"][] = ["active", "active", "active", "past_due", "canceled", "paused"]

  return Array.from({ length: 25 }, (_, i) => {
    const firstName = pick(FIRST_NAMES, rng)
    const lastName = pick(LAST_NAMES, rng)
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(rng() * 100)}@${pick(DOMAINS, rng)}`
    const planName = pick(PLANS, rng)
    const status = pick(statuses, rng)
    const startedAt = new Date(now)
    startedAt.setDate(startedAt.getDate() - Math.floor(rng() * 180))
    const nextBilling = new Date(startedAt)
    nextBilling.setMonth(nextBilling.getMonth() + 1)

    return {
      id: `sub_${String(i + 1).padStart(4, "0")}`,
      plan_name: planName,
      customer_email: email,
      customer_name: `${firstName} ${lastName}`,
      amount: Math.round(200_000 + rng() * 500_000),
      currency: "NGN",
      status,
      interval: pick(INTERVALS, rng),
      started_at: formatDate(startedAt),
      next_billing_date: status === "active" || status === "past_due" ? formatDate(nextBilling) : undefined,
      ended_at: status === "canceled" ? formatDate(now) : undefined,
      card_last_four: String(1000 + Math.floor(rng() * 9000)),
      card_brand: pick(["Visa", "Mastercard"], rng),
    }
  })
}

const MOCK_SUBSCRIPTIONS = generateMockSubscriptions()

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms))
}

export function useSubscriptions(projectId: string) {
  return useQuery({
    queryKey: ["subscriptions", projectId],
    queryFn: async () => {
      if (IS_MOCK_MODE) {
        await delay()
        return MOCK_SUBSCRIPTIONS
      }
      const response = await apiClient.get<Subscription[]>(
        ENDPOINTS.SUBSCRIPTIONS.LIST,
        { params: { projectId } },
      )
      return response.data
    },
  })
}

export function useCancelSubscription(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      if (IS_MOCK_MODE) {
        await delay(300)
        return
      }
      await apiClient.post(ENDPOINTS.SUBSCRIPTIONS.CANCEL(subscriptionId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", projectId] })
    },
  })
}

export function usePauseSubscription(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      if (IS_MOCK_MODE) {
        await delay(300)
        return
      }
      await apiClient.post(ENDPOINTS.SUBSCRIPTIONS.PAUSE(subscriptionId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", projectId] })
    },
  })
}

export function useResumeSubscription(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (subscriptionId: string) => {
      if (IS_MOCK_MODE) {
        await delay(300)
        return
      }
      await apiClient.post(ENDPOINTS.SUBSCRIPTIONS.RESUME(subscriptionId))
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions", projectId] })
    },
  })
}
