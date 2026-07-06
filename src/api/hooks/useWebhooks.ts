import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ENDPOINTS } from "@/api/ENDPOINTS";
import { apiClient } from "@/api/apiClient";
import type {
  WebhookEndpointCreate,
  WebhookEndpointRead,
  OutboundWebhookEventRead,
  WebhookDeliveryAttemptRead,
  EventCatalogRead,
} from "@/api/types/webhooks";

const queryKeys = {
  webhookEndpoints: (projectId: string) => ["webhooks", projectId, "endpoints"] as const,
  webhookEvents: (projectId: string, filters?: { eventType?: string; status?: string; skip?: number; limit?: number }) =>
    ["webhooks", projectId, "events", filters] as const,
  webhookDeliveries: (eventId: string) => ["webhooks", "events", eventId, "deliveries"] as const,
  eventCatalog: ["webhooks", "catalog"] as const,
};

export function useWebhookEndpoints(projectId: string) {
  return useQuery({
    queryKey: queryKeys.webhookEndpoints(projectId),
    queryFn: async () => {
      const response = await apiClient.get<WebhookEndpointRead[]>(ENDPOINTS.WEBHOOKS.OUTBOUND.ENDPOINTS.LIST, {
        params: { projectId },
      });
      return response.data;
    },
  });
}

export function useWebhookEvents(projectId: string, filters?: { eventType?: string; status?: string; skip?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.webhookEvents(projectId, filters),
    queryFn: async () => {
      const response = await apiClient.get<OutboundWebhookEventRead[]>(ENDPOINTS.WEBHOOKS.OUTBOUND.EVENTS.LIST, {
        params: { ...filters, projectId },
      });
      return response.data;
    },
  });
}

export function useWebhookDeliveries(eventId: string) {
  return useQuery({
    queryKey: queryKeys.webhookDeliveries(eventId),
    queryFn: async () => {
      const response = await apiClient.get<WebhookDeliveryAttemptRead[]>(ENDPOINTS.WEBHOOKS.OUTBOUND.EVENTS.DELIVERIES(eventId), {});
      return response.data;
    },
  });
}

export function useEventCatalog() {
  return useQuery({
    queryKey: queryKeys.eventCatalog,
    queryFn: async () => {
      const response = await apiClient.get<EventCatalogRead>(ENDPOINTS.WEBHOOKS.OUTBOUND.EVENTS.CATALOG);
      return response.data;
    },
  });
}

export function useCreateWebhookEndpoint(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: WebhookEndpointCreate) => {
      const response = await apiClient.post<WebhookEndpointRead>(ENDPOINTS.WEBHOOKS.OUTBOUND.ENDPOINTS.CREATE, data, {
        params: { projectId },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhookEndpoints(projectId) });
    },
  });
}

export function useDeleteWebhookEndpoint(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (endpointId: string) => {
      await apiClient.delete(ENDPOINTS.WEBHOOKS.OUTBOUND.ENDPOINTS.DELETE(endpointId), {
        params: { projectId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhookEndpoints(projectId) });
    },
  });
}
