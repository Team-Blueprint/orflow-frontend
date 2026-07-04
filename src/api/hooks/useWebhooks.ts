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

function delay(ms = 150) {
  return new Promise((r) => setTimeout(r, ms));
}

export function useWebhookEndpoints(projectId: string) {
  return useQuery({
    queryKey: queryKeys.webhookEndpoints(projectId),
    queryFn: async () => {
      await delay(); // Simulate network delay
      const response = await apiClient.get<WebhookEndpointRead[]>(ENDPOINTS.WEBHOOKS.OUTBOUND.ENDPOINTS.LIST, {
        params: { projectId }, // Assuming projectId is sent as a query param or header for tenant scoping
      });
      return response.data; // Should return an array of WebhookEndpointRead
    },
  });
}

export function useWebhookEvents(projectId: string, filters?: { eventType?: string; status?: string; skip?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.webhookEvents(projectId, filters),
    queryFn: async () => {
      await delay(); // Simulate network delay
      const response = await apiClient.get<OutboundWebhookEventRead[]>(ENDPOINTS.WEBHOOKS.OUTBOUND.EVENTS.LIST, {
        params: { ...filters, projectId }, // Assuming projectId and filters are sent as query params
      });
      return response.data; // Should return an array of OutboundWebhookEventRead
    },
  });
}

export function useWebhookDeliveries(eventId: string) {
  return useQuery({
    queryKey: queryKeys.webhookDeliveries(eventId),
    queryFn: async () => {
      await delay(); // Simulate network delay
      const response = await apiClient.get<WebhookDeliveryAttemptRead[]>(ENDPOINTS.WEBHOOKS.OUTBOUND.EVENTS.DELIVERIES(eventId), {
        // Assuming tenantId is handled by interceptors or similar
      });
      return response.data; // Should return an array of WebhookDeliveryAttemptRead
    },
  });
}

export function useEventCatalog() {
  return useQuery({
    queryKey: queryKeys.eventCatalog,
    queryFn: async () => {
      await delay(); // Simulate network delay
      const response = await apiClient.get<EventCatalogRead>(ENDPOINTS.WEBHOOKS.OUTBOUND.EVENTS.CATALOG);
      return response.data; // Should return EventCatalogRead
    },
  });
}

export function useCreateWebhookEndpoint(projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: WebhookEndpointCreate) => {
      await delay(300);
      const response = await apiClient.post<WebhookEndpointRead>(ENDPOINTS.WEBHOOKS.OUTBOUND.ENDPOINTS.CREATE, data, {
        params: { projectId }, // Assuming projectId is sent as a query param or header
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
      await delay(300);
      await apiClient.delete(ENDPOINTS.WEBHOOKS.OUTBOUND.ENDPOINTS.DELETE(endpointId), {
        params: { projectId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.webhookEndpoints(projectId) });
    },
  });
}
