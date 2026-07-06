import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { CustomerRead } from "@/api/types/customers"

export function useCustomers(projectId: string, params?: { offset?: number; limit?: number }) {
  const offset = params?.offset ?? 0
  const limit = params?.limit ?? 20

  return useQuery({
    queryKey: ["customers", projectId, offset, limit],
    queryFn: async () => {
      const response = await apiClient.get<CustomerRead[]>(
        ENDPOINTS.CUSTOMERS.LIST,
        { params: { offset, limit } },
      )
      const data = response.data
      return {
        data,
        total: data.length,
        offset,
        limit,
      }
    },
  })
}

export function useCreateCustomer(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: { email: string; name: string }) =>
      apiClient.post<CustomerRead>(
        ENDPOINTS.CUSTOMERS.CREATE,
        { ...data, tenant_id: projectId },
      ).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers", projectId] })
    },
  })
}
