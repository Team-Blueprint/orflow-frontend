import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AltArrowDown, AltArrowUp, Bell } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { WebhookEventDetail } from "./event-detail";
import type { OutboundWebhookEventRead } from "@/api/types/webhooks";

interface WebhookEventTableProps {
  events: OutboundWebhookEventRead[];
  expandedId: string | null;
  onToggleExpand: (id: string) => void;
  isLoading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
}

function EventBadge({ type }: { type: string }) {
  const label = type.split(".").pop() || type;
  return <Badge variant="outline" className="font-mono text-[10px] bg-midnight-soft/50">{label}</Badge>;
}

function StatusBadgeInline({ status }: { status: string }) {
  const colorClass = status === "successful" || status === "delivered" ? "text-emerald-500" : status === "failed" ? "text-red-500" : "text-amber-500";
  const bgColorClass = status === "successful" || status === "delivered" ? "bg-emerald-500" : status === "failed" ? "bg-red-500" : "bg-amber-500";
  const label = status === "successful" ? "delivered" : status;
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium", colorClass)}>
      <span className={cn("h-1.5 w-1.5", bgColorClass)} />
      {label}
    </span>
  );
}

export function WebhookEventTable({ events, expandedId, onToggleExpand, isLoading, hasMore, onLoadMore }: WebhookEventTableProps) {
  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <Bell className="h-12 w-12 text-ink-soft" />
        <p className="text-sm text-ink-soft">No webhook events yet.</p>
      </div>
    );
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <>
      <div className="hidden lg:block overflow-x-auto border border-hairline bg-paper">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-midnight-soft text-xs font-medium text-ink-soft">
              <th className="px-4 py-3 font-medium">Event</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium w-10" />
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <React.Fragment key={event.id}>
                <tr
                  onClick={() => onToggleExpand(event.id)}
                  onKeyDown={(e) => { if (e.key === "Enter") onToggleExpand(event.id); }}
                  tabIndex={0}
                  className="border-b border-hairline last:border-0 cursor-pointer transition-colors hover:bg-midnight-soft/50"
                >
                  <td className="px-4 py-3">
                    <EventBadge type={event.event_type} />
                  </td>
                  <td className="px-4 py-3 text-ink-soft whitespace-nowrap">{formatDate(event.created_at)}</td>
                  <td className="px-4 py-3">
                    <StatusBadgeInline status={event.status} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleExpand(event.id); }}
                      className="p-1 transition-colors hover:bg-midnight-soft cursor-pointer"
                      aria-label={expandedId === event.id ? "Collapse" : "Expand"}
                    >
                      {expandedId === event.id ? (
                        <AltArrowUp size={16} className="text-ink-soft" />
                      ) : (
                        <AltArrowDown size={16} className="text-ink-soft" />
                      )}
                    </button>
                  </td>
                </tr>
                {expandedId === event.id && (
                  <tr key={`${event.id}-detail`}>
                    <td colSpan={4} className="px-4 py-4 bg-midnight-soft/30">
                      <WebhookEventDetail event={event} />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="lg:hidden divide-y divide-hairline">
        {events.map((event) => (
          <div key={event.id}>
            <button
              onClick={() => onToggleExpand(event.id)}
              className="w-full text-left py-3 -mx-4 px-4 sm:-mx-6 sm:px-6 flex items-center justify-between gap-2 hover:bg-midnight-soft/30 transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <EventBadge type={event.event_type} />
                  <StatusBadgeInline status={event.status} />
                </div>
                <div className="text-xs text-ink-soft mt-0.5">{formatDate(event.created_at)}</div>
              </div>
              {expandedId === event.id ? (
                <AltArrowUp size={16} className="shrink-0 text-ink-soft" />
              ) : (
                <AltArrowDown size={16} className="shrink-0 text-ink-soft" />
              )}
            </button>
            {expandedId === event.id && (
              <div className="px-4 pb-4 sm:px-6">
                <WebhookEventDetail event={event} />
              </div>
            )}
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6">
          <Button
            onClick={onLoadMore}
            variant="outline"
            className="text-sm px-6"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </>
  );
}
