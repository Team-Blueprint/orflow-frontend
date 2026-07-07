import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import {
  useWebhookEvents,
  useWebhookEndpoints,
  useCreateWebhookEndpoint,
  useDeleteWebhookEndpoint,
} from "@/api/hooks/useWebhooks";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { MenuDots } from "@solar-icons/react";
import { cn } from "@/lib/utils";
import { WebhookFilters, WebhookEventTable, WebhookSkeleton } from "@/components/webhooks";
import type { OutboundWebhookEventRead } from "@/api/types/webhooks";
import { useToast } from "@/components/webhooks/utils/toast";

export const Route = createFileRoute("/dashboard/$projectId/webhooks/")({
  component: WebhooksPage,
});

const ITEMS_PER_PAGE = 20;

function WebhooksPage() {
  const { projectId } = Route.useParams();
  const queryClient = useQueryClient();
  const toast = useToast();
  useDocumentTitle("Webhooks | Orflow");

  const { data: webhookEndpoints, isLoading: isEndpointsLoading } = useWebhookEndpoints(projectId);

  const [isConfigExpanded, setIsConfigExpanded] = useState(true);
  const [eventTypeFilter, setEventTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [allEvents, setAllEvents] = useState<OutboundWebhookEventRead[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const { data: events, isLoading: isEventsLoading, refetch: refetchEvents } = useWebhookEvents(projectId, {
    eventType: eventTypeFilter || undefined,
    status: statusFilter || undefined,
    skip: page * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  });

  useEffect(() => {
    if (events) {
      setAllEvents((prev) => {
        if (page === 0) return events;
        const existingIds = new Set(prev.map((e) => e.id));
        const newEvents = events.filter((e) => !existingIds.has(e.id));
        return [...prev, ...newEvents];
      });
    }
  }, [events, page]);

  useEffect(() => {
    setAllEvents([]);
    setPage(0);
  }, [eventTypeFilter, statusFilter]);

  const totalDelivered = allEvents.filter((e) => e.status === "delivered").length;
  const totalFailed = allEvents.filter((e) => e.status === "failed").length;

  function toggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  function loadMore() {
    setPage((p) => p + 1);
  }

  function handleRefresh() {
    setAllEvents([]);
    setPage(0);
    refetchEvents();
  }

  const currentWebhookConfig = webhookEndpoints?.[0];
  const [webhookUrl, setWebhookUrl] = useState(currentWebhookConfig?.url || "");
  const createEndpointMutation = useCreateWebhookEndpoint(projectId);
  const deleteEndpointMutation = useDeleteWebhookEndpoint(projectId);

  useEffect(() => {
    if (currentWebhookConfig) {
      setWebhookUrl(currentWebhookConfig.url);
    } else {
      setWebhookUrl("");
    }
  }, [currentWebhookConfig, projectId]);

  const hasUrlChanged = currentWebhookConfig
    ? webhookUrl !== currentWebhookConfig.url
    : webhookUrl.trim().length > 0;

  async function handleCreateOrUpdateWebhook(e: React.FormEvent) {
    e.preventDefault();
    if (webhookUrl.trim() === "") return;

    try {
      if (currentWebhookConfig) {
        await deleteEndpointMutation.mutateAsync(currentWebhookConfig.id);
        await createEndpointMutation.mutateAsync({ url: webhookUrl });
      } else {
        await createEndpointMutation.mutateAsync({ url: webhookUrl });
      }
      toast.success("Webhook configuration saved");
    } catch {
      toast.error("Failed to save webhook configuration");
    }
  }

  async function handleRegenerateSecret() {
    if (!currentWebhookConfig) return;
    try {
      await deleteEndpointMutation.mutateAsync(currentWebhookConfig.id);
      await createEndpointMutation.mutateAsync({ url: currentWebhookConfig.url });
      toast.success("Webhook configuration saved");
    } catch {
      toast.error("Failed to regenerate webhook secret");
    }
  }

  async function handleDeleteEndpoint() {
    if (!currentWebhookConfig) return;
    try {
      await deleteEndpointMutation.mutateAsync(currentWebhookConfig.id);
      setWebhookUrl("");
      queryClient.setQueryData(["webhooks", projectId, "endpoints"], []);
      setDeleteConfirmOpen(false);
      toast.success("Webhook configuration saved");
    } catch {
      toast.error("Failed to delete webhook");
    }
  }

  async function handleTestPing() {
    if (!currentWebhookConfig) return;
    toast.loading("Sending test payload...");
    try {
      await createEndpointMutation.mutateAsync({ url: currentWebhookConfig.url });
      toast.success("Ping successful");
    } catch {
      toast.error("Ping failed to deliver");
    }
  }

  if (isEndpointsLoading && !webhookEndpoints) {
    return <WebhookSkeleton />;
  }

  return (
    <div className="flex flex-col gap-5 sm:gap-6 p-4 sm:px-8 sm:pt-4 sm:pb-8">
      <div className="border border-hairline bg-paper p-6 shadow-soft-lift">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsConfigExpanded(!isConfigExpanded)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <svg
              width={20}
              height={20}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className={cn(
                "text-ink-soft transition-transform duration-150",
                isConfigExpanded ? "rotate-180" : "",
              )}
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
            <h2 className="text-xl font-semibold tracking-tight text-ink">Webhook Configuration</h2>
          </button>

          {currentWebhookConfig && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex items-center justify-center size-8 rounded hover:bg-midnight-soft transition-colors duration-150 cursor-pointer"
                >
                  <MenuDots className="size-5 text-ink-soft" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={handleRegenerateSecret}
                  disabled={createEndpointMutation.isPending || deleteEndpointMutation.isPending}
                >
                  Regenerate Secret
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => setDeleteConfirmOpen(true)}
                  className="text-red-500 focus:text-red-400 focus:bg-red-500/10"
                >
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {isConfigExpanded && (
          <div className="mt-6 space-y-6">
            {currentWebhookConfig ? (
              <form onSubmit={handleCreateOrUpdateWebhook} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="webhook-url" className="text-xs font-medium text-ink-soft">Webhook URL</label>
                  <Input
                    id="webhook-url"
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-app.com/webhooks"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-ink-soft">Signing Secret</span>
                  <div className="flex border border-hairline">
                    <div className="flex-1 truncate bg-canvas px-3 py-2 font-mono text-xs text-ink select-all">
                      whsec_{"\u2022".repeat(24)}
                    </div>
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(currentWebhookConfig.secret)}
                      className="cursor-pointer border-l border-hairline bg-midnight-soft px-3 text-xs font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2 w-2",
                      currentWebhookConfig.is_active ? "bg-emerald-500" : "bg-zinc-500",
                    )}
                  />
                  <span className="text-xs text-ink-soft">
                    {currentWebhookConfig.is_active ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-hairline">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={handleTestPing}
                    disabled={createEndpointMutation.isPending || deleteEndpointMutation.isPending}
                  >
                    Test Ping
                  </Button>
                  <Button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary-hover text-xs px-4 py-1.5"
                    size="sm"
                    disabled={!hasUrlChanged || createEndpointMutation.isPending || deleteEndpointMutation.isPending}
                  >
                    {createEndpointMutation.isPending ? "Saving..." : "Save URL"}
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreateOrUpdateWebhook} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="webhook-url" className="text-xs font-medium text-ink-soft">Webhook URL</label>
                  <Input
                    id="webhook-url"
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://your-app.com/webhooks"
                    required
                  />
                </div>
                <div className="flex items-center justify-end pt-4 border-t border-hairline">
                  <Button
                    type="submit"
                    className="bg-primary text-white hover:bg-primary-hover text-xs px-4 py-1.5"
                    size="sm"
                    disabled={!webhookUrl.trim() || createEndpointMutation.isPending}
                  >
                    {createEndpointMutation.isPending ? "Creating..." : "Create Webhook"}
                  </Button>
                </div>
              </form>
            )}
            {createEndpointMutation.isError && <p className="text-destructive text-sm">Failed to create/update webhook.</p>}
            {deleteEndpointMutation.isError && <p className="text-destructive text-sm">Failed to delete webhook.</p>}
          </div>
        )}
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete webhook endpoint</DialogTitle>
            <DialogDescription>
              This will permanently delete this webhook endpoint and its signing secret. All pending events will stop being sent to this URL. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700 text-xs"
              size="sm"
              onClick={handleDeleteEndpoint}
              disabled={deleteEndpointMutation.isPending}
            >
              {deleteEndpointMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <h2 className="text-xl font-semibold tracking-tight text-ink">Webhook Events</h2>
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="text-xs"
            disabled={isEventsLoading}
          >
            {isEventsLoading ? "Loading..." : "Refresh Logs"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total Events" value={allEvents.length} />
          <StatCard label="Delivered" value={totalDelivered} variant="success" />
          <StatCard label="Failed" value={totalFailed} variant="destructive" />
        </div>

        <WebhookFilters
          eventType={eventTypeFilter}
          onEventTypeChange={setEventTypeFilter}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {isEventsLoading && page === 0 ? (
          <EventsSkeleton />
        ) : (
          <WebhookEventTable
            events={allEvents}
            expandedId={expandedId}
            onToggleExpand={toggleExpand}
            isLoading={isEventsLoading}
            hasMore={!!(events && events.length === ITEMS_PER_PAGE)}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </div>
  );
}

function EventsSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="border border-hairline bg-paper p-4">
          <div className="h-4 w-32 bg-midnight-soft animate-pulse mb-2" />
          <div className="h-3 w-full bg-midnight-soft animate-pulse mb-1" />
          <div className="h-3 w-3/4 bg-midnight-soft animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, variant }: { label: string; value: number; variant?: "success" | "destructive" }) {
  const colorClass = variant === "success"
    ? "text-emerald-500"
    : variant === "destructive"
    ? "text-red-500"
    : "text-ink";
  return (
    <div className="border border-hairline bg-paper p-4">
      <p className="text-xs text-ink-soft">{label}</p>
      <p className={cn("mt-1 text-2xl font-semibold tabular-nums", colorClass)}>{value}</p>
    </div>
  );
}
