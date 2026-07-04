import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from "@/components/ui/select";
import { useEventCatalog } from "@/api/hooks/useWebhooks";

const FALLBACK_EVENT_TYPES = [
  "subscription.created",
  "subscription.activated",
  "subscription.canceled",
  "subscription.paused",
  "subscription.trial_ending",
  "invoice.paid",
  "invoice.payment_failed",
  "payment_method.attached",
];

interface WebhookFiltersProps {
  eventType: string;
  onEventTypeChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
}

export function WebhookFilters({ eventType, onEventTypeChange, status, onStatusChange }: WebhookFiltersProps) {
  const { data: catalog } = useEventCatalog();
  const eventTypes = catalog?.events?.map((e) => e.type) ?? FALLBACK_EVENT_TYPES;

  return (
    <div className="flex gap-2 overflow-x-auto">
      <Select value={eventType} onValueChange={(value) => onEventTypeChange(value === "all" ? "" : value)}>
        <SelectTrigger className="h-9 min-w-fit">
          <SelectValue placeholder="All event types" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Event Type</SelectLabel>
            <SelectItem value="all">All event types</SelectItem>
            {eventTypes.map((type) => (
              <SelectItem key={type} value={type}>{type}</SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>

      <Select value={status} onValueChange={(value) => onStatusChange(value === "all" ? "" : value)}>
        <SelectTrigger className="h-9 min-w-fit">
          <SelectValue placeholder="All statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
