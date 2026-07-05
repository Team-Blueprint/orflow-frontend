import { useState, type FormEvent } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { useCreateCustomer } from "@/api/hooks/useCustomers"
import { useToast } from "@/components/webhooks/utils/toast"

interface CreateCustomerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
}

export function CreateCustomerModal({ open, onOpenChange, projectId }: CreateCustomerModalProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const createMutation = useCreateCustomer(projectId)
  const toast = useToast()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    createMutation.mutate(
      { name: name.trim(), email: email.trim() },
      {
        onSuccess: () => {
          toast.success("Customer saved")
          setName("")
          setEmail("")
          onOpenChange(false)
        },
        onError: () => {
          toast.error("Failed to save customer")
        },
      },
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Customer</DialogTitle>
          <DialogDescription>
            Add a customer profile to your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-name" className="text-xs font-semibold text-ink">
              Name
            </label>
            <input
              id="cust-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Doe"
              required
              className="w-full bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="cust-email" className="text-xs font-semibold text-ink">
              Email
            </label>
            <input
              id="cust-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              required
              className="w-full bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => { setName(""); setEmail(""); onOpenChange(false) }}
              className="px-4 py-2 text-xs font-semibold text-ink-soft hover:text-ink border border-hairline bg-transparent cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="btn-primary text-xs font-bold px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {createMutation.isPending ? "Creating..." : "Create Customer"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
