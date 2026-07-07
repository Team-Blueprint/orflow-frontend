import { useSubscriptionPages, useCreateSubscriptionPage, useDeleteSubscriptionPage, useUpdateSubscriptionPage } from "@/api/hooks/useSubscriptionPages"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/webhooks/utils/toast"

interface SubscriptionPagesListProps {
  planId: string
  projectId: string
}

export function SubscriptionPagesList({ planId, projectId }: SubscriptionPagesListProps) {
  const { data: pages = [], isLoading: isPagesLoading } = useSubscriptionPages(projectId)
  const createPage = useCreateSubscriptionPage(projectId)
  const deletePage = useDeleteSubscriptionPage(projectId)
  const togglePage = useUpdateSubscriptionPage(projectId)
  const toast = useToast()

  const planPages = pages.filter((p) => p.plan_id === planId)

  const handleCreatePage = () => {
    createPage.mutate({ plan_id: planId }, {
      onSuccess: () => toast.success("Subscription page created"),
      onError: () => toast.error("Failed to create subscription page"),
    })
  }

  const handleTogglePage = (pageId: string, isActive: boolean) => {
    togglePage.mutate({ pageId, is_active: !isActive }, {
      onSuccess: () => toast.success(isActive ? "Page deactivated" : "Page activated"),
      onError: () => toast.error("Failed to update page"),
    })
  }

  const handleDeletePage = (pageId: string) => {
    deletePage.mutate(pageId, {
      onSuccess: () => toast.success("Subscription page deleted"),
      onError: () => toast.error("Failed to delete page"),
    })
  }

  const handleCopyUrl = async (url: string) => {
    const fullUrl = `${window.location.origin}${url}`
    await navigator.clipboard.writeText(fullUrl)
    toast.success("Link copied to clipboard")
  }

  const getModeBadge = (isTest: boolean) => (
    <Badge
      variant="outline"
      className={isTest
        ? "border-zinc-600 text-zinc-400 bg-zinc-900/30"
        : "border-emerald-600 text-emerald-400 bg-emerald-900/30"}
    >
      {isTest ? "TEST" : "LIVE"}
    </Badge>
  )

  const getStatusIndicator = (isActive: boolean) => (
    <span className="flex items-center gap-1.5">
      <span
        className={`size-2 rounded-full ${
          isActive ? "bg-emerald-500 animate-pulse" : "bg-zinc-500"
        }`}
      />
      <span className="text-xs font-medium text-ink">{isActive ? "Active" : "Inactive"}</span>
    </span>
  )

  const getFullUrl = (url: string) => `${window.location.origin}${url}`

  const createButton = (
    <Button
      onClick={handleCreatePage}
      disabled={createPage.isPending}
      size="sm"
      className="gap-1.5"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      {createPage.isPending ? "Creating..." : "Create Link"}
    </Button>
  )

  if (isPagesLoading) {
    return (
      <div className="border border-hairline bg-paper p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ink">Subscription Pages</h3>
          {createButton}
        </div>
        <div className="h-10 bg-zinc-800 animate-pulse" />
      </div>
    )
  }

  if (planPages.length === 0) {
    return (
      <div className="border border-hairline bg-paper p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-ink">Subscription Pages</h3>
          {createButton}
        </div>
        <div className="border-2 border-dashed border-zinc-700 bg-zinc-900/30 p-6 text-center">
          <p className="text-sm text-ink-soft">No subscription pages yet.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border border-hairline bg-paper p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-ink">Subscription Pages</h3>
        {createButton}
      </div>
      <div className="flex flex-col gap-3">
        {planPages.map((p) => (
          <div key={p.id} className="border border-hairline bg-midnight-soft p-4">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-3">
                {getModeBadge(p.is_test)}
                {getStatusIndicator(p.is_active)}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon-sm" className="h-8 w-8 opacity-50 hover:opacity-100 transition-opacity">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1" />
                      <circle cx="19" cy="12" r="1" />
                      <circle cx="5" cy="12" r="1" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-[160px]">
                  <DropdownMenuItem
                    onClick={() => handleCopyUrl(p.url)}
                    className="flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleTogglePage(p.id, p.is_active)}
                    className="flex items-center gap-2"
                  >
                    {p.is_active ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                        </svg>
                        Deactivate
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        Activate
                      </>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleDeletePage(p.id)}
                    className="text-destructive flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="bg-canvas border border-hairline px-3 py-2">
              <a
                href={getFullUrl(p.url)}
                target="_blank"
                rel="noopener noreferrer"
                className="truncate max-w-[280px] sm:max-w-[400px] block font-mono text-[11px] text-ink-soft hover:text-primary transition-colors"
              >
                {getFullUrl(p.url)}
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}