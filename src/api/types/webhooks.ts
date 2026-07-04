export interface WebhookEndpointCreate {
  url: string;
  description?: string;
}

export interface WebhookEndpointRead {
  id: string;
  tenant_id: string;
  url: string;
  secret: string;
  description?: string;
  is_active: boolean;
  created_at: string;
}

export interface OutboundWebhookEventRead {
  id: string;
  tenant_id: string;
  event_type: string;
  payload: Record<string, unknown>;
  status: string;
  created_at: string;
}

export interface WebhookDeliveryAttemptRead {
  id: string;
  event_id: string;
  status_code?: number;
  response_body?: string;
  attempt_number: number;
  created_at: string;
}

export interface EventCatalogEntry {
  type: string;
  description: string;
}

export interface EventCatalogRead {
  events: EventCatalogEntry[];
}
