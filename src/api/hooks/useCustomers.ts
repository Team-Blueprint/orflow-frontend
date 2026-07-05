import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { CustomerRead, CustomerListResponse } from "@/api/types/customers"

const IS_MOCK_MODE = true

const FIRST_NAMES = ["Alice", "Bob", "Carol", "Dave", "Eve", "Frank", "Grace", "Hank", "Iris", "Jack", "Kate", "Leo", "Mia", "Noah", "Olivia"]
const LAST_NAMES = ["Johnson", "Smith", "Brown", "Williams", "Jones", "Garcia", "Miller", "Davis", "Martinez", "Lee", "Wilson", "Taylor"]
const DOMAINS = ["gmail.com", "outlook.com", "example.com", "acme.co", "startup.io"]
const PLANS = ["Starter Monthly", "Pro Monthly", "Enterprise Yearly", "Basic Quarterly", "Premium Weekly"]

const STATUSES: CustomerRead["activity_status"][] = ["active", "active", "active", "inactive", "suspended"]

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

function generateMockCustomers(): CustomerRead[] {
  const rng = seedRandom(77)
  const now = new Date()

  return Array.from({ length: 30 }, (_, i) => {
    const firstName = pick(FIRST_NAMES, rng)
    const lastName = pick(LAST_NAMES, rng)
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(rng() * 100)}@${pick(DOMAINS, rng)}`
    const status = pick(STATUSES, rng)
    const daysAgo = Math.floor(rng() * 365)
    const createdDate = new Date(now)
    createdDate.setDate(createdDate.getDate() - daysAgo)
    const lastSeen = rng() > 0.2
      ? new Date(now.getTime() - Math.floor(rng() * 7 * 24 * 60 * 60 * 1000)).toISOString()
      : null

    return {
      id: `cust_${String(i + 1).padStart(3, "0")}`,
      tenant_id: "tenant_001",
      email,
      name: `${firstName} ${lastName}`,
      activity_status: status,
      last_seen: lastSeen,
      created_at: createdDate.toISOString(),
      updated_at: createdDate.toISOString(),
      plan_name: pick(PLANS, rng),
      card_last_four: rng() > 0.3 ? String(1000 + Math.floor(rng() * 9000)) : undefined,
      card_brand: rng() > 0.3 ? pick(["Visa", "Mastercard", "Verve"], rng) : undefined,
    }
  })
}

const MOCK_CUSTOMERS = generateMockCustomers()

function delay(ms = 200) {
  return new Promise((r) => setTimeout(r, ms))
}

let mockCustomerIdCounter = 31

export function useCreateCustomer(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { email: string; name: string }) => {
      if (IS_MOCK_MODE) {
        await delay(300)
        const newCustomer: CustomerRead = {
          id: `cust_${String(mockCustomerIdCounter++).padStart(3, "0")}`,
          tenant_id: "tenant_001",
          email: data.email,
          name: data.name,
          activity_status: "active",
          last_seen: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
        MOCK_CUSTOMERS.unshift(newCustomer)
        return newCustomer
      }
      const response = await apiClient.post<CustomerRead>(
        ENDPOINTS.CUSTOMERS.CREATE,
        { ...data, tenant_id: projectId },
      )
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", projectId] })
    },
  })
}

export function useCustomers(projectId: string, params?: { offset?: number; limit?: number; planId?: string }) {
  const offset = params?.offset ?? 0
  const limit = params?.limit ?? 20

  return useQuery({
    queryKey: ["customers", projectId, offset, limit, params?.planId],
    queryFn: async () => {
      if (IS_MOCK_MODE) {
        await delay()
        let filtered = MOCK_CUSTOMERS
        if (params?.planId) {
          filtered = filtered.filter((c) => c.plan_name === pick(PLANS, seedRandom(42)))
        }
        const page = filtered.slice(offset, offset + limit)
        return {
          data: page,
          total: filtered.length,
          offset,
          limit,
        } satisfies CustomerListResponse
      }
      const response = await apiClient.get<CustomerListResponse>(
        ENDPOINTS.CUSTOMERS.LIST,
        { params: { offset, limit, plan_id: params?.planId } },
      )
      return response.data
    },
  })
}
