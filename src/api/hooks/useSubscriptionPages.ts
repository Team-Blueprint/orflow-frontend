import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/api/apiClient"
import type { SubscriptionPageWithPlanRead, SubscriptionPageCreate, SubscriptionPageUpdate, SubscriptionPageRead } from "@/api/types/subscription-pages"

function mapPage(raw: any): SubscriptionPageWithPlanRead {
  return {
    ...raw,
    environment: raw.is_test ? "TEST" : "LIVE",
  }
}

export function useSubscriptionPages(projectId: string) {
  return useQuery({
    queryKey: ["subscription-pages", projectId],
    queryFn: () =>
      apiClient.get<any[]>(
        "/v1/subscription-pages/list",
        { params: { projectId } },
      ).then(res => res.data.map(mapPage)),
  })
}

export function useSubscriptionPage(pageId: string) {
  return useQuery({
    queryKey: ["subscription-page", pageId],
    queryFn: () =>
      apiClient.get<SubscriptionPageWithPlanRead>(
        `/v1/subscription-pages/${pageId}`,
      ).then(res => res.data),
    enabled: !!pageId,
  })
}

export function useCreateSubscriptionPage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: SubscriptionPageCreate) =>
      apiClient.post<SubscriptionPageRead>(
        "/v1/subscription-pages/create",
        payload,
      ).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-pages", projectId] })
    },
  })
}

export function useUpdateSubscriptionPage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, ...payload }: { pageId: string } & SubscriptionPageUpdate) =>
      apiClient.patch<SubscriptionPageRead>(
        `/v1/subscription-pages/${pageId}/update`,
        payload,
      ).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-pages", projectId] })
    },
  })
}

export function useToggleSubscriptionPage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ pageId, isActive }: { pageId: string; isActive: boolean }) =>
      apiClient.patch<SubscriptionPageRead>(
        `/v1/subscription-pages/${pageId}/update`,
        { is_active: isActive },
      ).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-pages", projectId] })
    },
  })
}

export function useDeleteSubscriptionPage(projectId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (pageId: string) =>
      apiClient.delete(`/v1/subscription-pages/${pageId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscription-pages", projectId] })
    },
  })
}
