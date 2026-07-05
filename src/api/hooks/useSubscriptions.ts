import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { Subscription } from "@/api/types/subscriptions"

const IS_MOCK_MODE = true

const PLANS = ["Starter Monthly", "Pro Monthly", "Enterprise Yearly", "Basic Quarterly", "Premium Weekly"]
const FIRST_NAMES = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank", "Iris", "Jack"]
const LAST_NAMES = ["Johnson", "Smith", "Brown", "Williams", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Lee"]
const DOMAINS = ["gmail.com", "outlook.com", "example.com", "acme.co", "startup.io"]

const STATUSES: Subscription["status"][] = [
  "active", "active", "active", "past_due", "canceled", "paused",
  "incomplete", "trialing", "unpaid", "defaulted", "completed",
]

const TYPES: Subscription["type"][] = ["recurring", "recurring", "recurring", "installment"]

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
  return d.toISOString()
}

function generateMockSubscriptions(): Subscription[] {
  const rng = seedRandom(99)
  const now = new Date()

  return Array.from({ length: 25 }, (_, i) => {
    const firstName = pick(FIRST_NAMES, rng)
    const lastName = pick(LAST_NAMES, rng)
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(rng() * 100)}@${pick(DOMAINS, rng)}`
    const planName = pick(PLANS, rng)
    const status = pick(STATUSES, rng)
    const type = pick(TYPES, rng)
    const daysAgo = Math.floor(rng() * 180)
    const createdDate = new Date(now)
    createdDate.setDate(createdDate.getDate() - daysAgo)
    const periodEnd = new Date(createdDate)
    periodEnd.setMonth(periodEnd.getMonth() + 1)

    return {
      id: `sub_${String(i + 1).padStart(4, "0")}`,
      tenant_id: "tenant_001",
      customer_id: `cust_${String(i + 1).padStart(3, "0")}`,
      plan_id: `plan_${String((i % 5) + 1).padStart(3, "0")}`,
      payment_method_id: i % 3 === 0 ? null : `pm_${String(i + 1).padStart(4, "0")}`,
      status,
      type,
      current_period_start: status === "active" || status === "past_due" || status === "trialing" ? formatDate(createdDate) : null,
      current_period_end: status === "active" || status === "past_due" || status === "trialing" ? formatDate(periodEnd) : null,
      trial_end: status === "trialing" ? formatDate(periodEnd) : null,
      canceled_at: status === "canceled" ? formatDate(now) : null,
      cancel_at_period_end: status === "active" && rng() > 0.7,
      created_at: formatDate(createdDate),
      updated_at: formatDate(createdDate),
      plan_name: planName,
      customer_email: email,
      customer_name: `${firstName} ${lastName}`,
      amount: Math.round(200_000 + rng() * 500_000),
      currency: "NGN",
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
