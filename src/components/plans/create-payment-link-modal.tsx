import { useState, type FormEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCreatePaymentLink } from "@/api/hooks/usePaymentLinks"
import { useToast } from "@/components/webhooks/utils/toast"

interface CreatePaymentLinkModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  planId: string
}

export function CreatePaymentLinkModal({ open, onOpenChange, projectId, planId }: CreatePaymentLinkModalProps) {
  const [planName, setPlanName] = useState("")
  const createMutation = useCreatePaymentLink(projectId, planId)
  const toast = useToast()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    createMutation.mutate(
      { plan_name: planName || undefined },
      {
        onSuccess: () => {
          toast.success("Payment link generated successfully")
          setPlanName("")
          onOpenChange(false)
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Payment Link</DialogTitle>
          <DialogDescription>
            Generate a checkout link for this plan. A unique slug will be auto-generated.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="pl-plan-name" className="text-xs font-semibold text-ink">
              Plan name
              <span className="text-ink-soft/60 ml-1">opt</span>
            </label>
            <input
              id="pl-plan-name"
              type="text"
              value={planName}
              onChange={(e) => setPlanName(e.target.value)}
              placeholder="My Checkout Link"
              className="w-full bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
            />
            <p className="text-[10px] text-ink-soft/60">
              Slug will be <code className="font-mono text-ink-soft">checkout_orflow_&lt;random&gt;</code>
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setPlanName(""); onOpenChange(false) }}
              className="px-4 py-2 text-xs font-semibold text-ink-soft hover:text-ink border border-hairline bg-transparent cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary text-xs font-bold px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? "Creating..." : "Create Link"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
