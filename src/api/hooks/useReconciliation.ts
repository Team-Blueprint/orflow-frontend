import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"
import type { ReconciliationDiscrepancyPage, ReconciliationDiscrepancy, DiscrepancyFilterParams } from "@/api/types/reconciliation"

export function useDiscrepancies(params: DiscrepancyFilterParams) {
  const { run_id, discrepancy_type, resolved, page = 1, per_page = 20 } = params
  return useQuery({
    queryKey: ["reconciliation", "discrepancies", { run_id, discrepancy_type, resolved, page, per_page }],
    queryFn: async () => {
      const qp: Record<string, string> = { page: String(page), per_page: String(per_page) }
      if (run_id) qp.run_id = run_id
      if (discrepancy_type) qp.discrepancy_type = discrepancy_type
      if (resolved !== "") qp.resolved = String(resolved)
      const res = await apiClient.get<ReconciliationDiscrepancyPage>(
        ENDPOINTS.RECONCILIATION.DISCREPANCIES.LIST,
        { params: qp },
      )
      return res.data
    },
  })
}

export function useResolveDiscrepancy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, resolution_note }: { id: string; resolution_note: string }) =>
      apiClient.patch<ReconciliationDiscrepancy>(
        ENDPOINTS.RECONCILIATION.DISCREPANCIES.RESOLVE(id),
        { resolution_note },
      ).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reconciliation", "discrepancies"] })
    },
  })
}
