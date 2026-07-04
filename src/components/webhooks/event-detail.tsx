import { useWebhookDeliveries } from "@/api/hooks/useWebhooks";
import { cn } from "@/lib/utils";
import { SyntaxHighlighter } from "./utils/syntax-highlighter";
import type { OutboundWebhookEventRead } from "@/api/types/webhooks";

interface WebhookEventDetailProps {
  event: OutboundWebhookEventRead;
}

export function WebhookEventDetail({ event }: WebhookEventDetailProps) {
  const { data: deliveries, isLoading: isDeliveriesLoading } = useWebhookDeliveries(event.id);
  const latestDelivery = deliveries?.[0];

  return (
    <div className="grid gap-4 sm:grid-cols-2 text-xs">
      <div className="min-w-0">
        <p className="font-medium text-ink-soft mb-1">Request Payload</p>
        <div className="border border-hairline bg-canvas p-3 overflow-x-auto max-h-48 overflow-y-auto">
          <SyntaxHighlighter
            code={JSON.stringify(event.payload, null, 2)}
            language="json"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <p className="font-medium text-ink-soft mb-1">Latest Response</p>
          {isDeliveriesLoading ? (
            <div className="h-10 w-full bg-midnight-soft animate-pulse" />
          ) : latestDelivery ? (
            <div className="border border-hairline bg-canvas p-3">
              <span className="font-mono text-[11px] text-ink">{latestDelivery.response_body || "No response body"}</span>
              <span className={cn("ml-2 text-[11px] font-medium", latestDelivery.status_code && latestDelivery.status_code < 400 ? "text-emerald-500" : "text-red-500")}>
                ({latestDelivery.status_code || "N/A"})
              </span>
            </div>
          ) : (
            <div className="border border-hairline bg-canvas p-3 text-ink-soft text-[11px]">No delivery attempts yet.</div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="font-medium text-ink-soft mb-0.5">Total Attempts</p>
            <p className="font-mono tabular-nums text-ink">{deliveries?.length ?? "—"}</p>
          </div>
          {latestDelivery && (
            <div>
              <p className="font-medium text-ink-soft mb-0.5">Attempt #</p>
              <p className="font-mono tabular-nums text-ink">{latestDelivery.attempt_number}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
