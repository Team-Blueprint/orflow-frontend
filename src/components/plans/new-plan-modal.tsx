import { useState, type FormEvent } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { apiClient } from "@/api/apiClient"
import { ENDPOINTS } from "@/api/ENDPOINTS"

const INTERVALS = [
  "daily", "weekly", "monthly", "quarterly", "yearly",
  "annually", "biannually",
] as const

interface NewPlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewPlanModal({ open, onOpenChange }: NewPlanModalProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [amount, setAmount] = useState("")
  const [interval, setInterval] = useState("monthly")
  const [intervalCount, setIntervalCount] = useState("1")
  const [trialPeriodDays, setTrialPeriodDays] = useState("")
  const [installmentsCount, setInstallmentsCount] = useState("")
  const [error, setError] = useState("")

  const mutation = useMutation({
    mutationFn: (data: Record<string, unknown>) =>
      apiClient.post(ENDPOINTS.PLANS.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["plans"] })
      resetForm()
      onOpenChange(false)
    },
    onError: (err: unknown) => {
      if (err instanceof AxiosError && err.response?.data?.error?.message) {
        setError(err.response.data.error.message)
      } else if (err instanceof AxiosError && err.response?.data?.detail) {
        setError(err.response.data.detail)
      } else {
        setError("Failed to create plan")
      }
    },
  })

  function resetForm() {
    setName("")
    setAmount("")
    setInterval("monthly")
    setIntervalCount("1")
    setTrialPeriodDays("")
    setInstallmentsCount("")
    setError("")
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")

    const parsedAmount = parseFloat(amount)
    if (!name || isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Name and a valid amount are required")
      return
    }

    mutation.mutate({
      name,
      amount: parsedAmount,
      currency: "NGN",
      interval,
      interval_count: parseInt(intervalCount, 10) || 1,
      trial_period_days: trialPeriodDays ? parseInt(trialPeriodDays, 10) : null,
      installments_count: installmentsCount ? parseInt(installmentsCount, 10) : null,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New plan</DialogTitle>
          <DialogDescription>
            Create a pricing plan for your workspace.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pt-2">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="plan-name" className="text-xs font-semibold text-ink">
              Name
            </label>
            <input
              id="plan-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Basic Monthly"
              required
              className="w-full bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="plan-amount" className="text-xs font-semibold text-ink">
              Amount (₦)
            </label>
            <input
              id="plan-amount"
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000.00"
              required
              className="w-full bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
            />
          </div>

          <input type="hidden" value="NGN" />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink">Interval</label>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {INTERVALS.map((i) => (
                  <SelectItem key={i} value={i}>
                    {i.charAt(0).toUpperCase() + i.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="plan-interval-count" className="text-xs font-semibold text-ink">
              Interval count
            </label>
            <input
              id="plan-interval-count"
              type="number"
              min="1"
              value={intervalCount}
              onChange={(e) => setIntervalCount(e.target.value)}
              className="w-full bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="plan-trial" className="text-xs font-semibold text-ink">
                Trial (days) <span className="text-ink-soft/60">opt</span>
              </label>
              <input
                id="plan-trial"
                type="number"
                min="0"
                value={trialPeriodDays}
                onChange={(e) => setTrialPeriodDays(e.target.value)}
                placeholder="7"
                className="w-full bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="plan-installments" className="text-xs font-semibold text-ink">
                Max payments <span className="text-ink-soft/60">opt</span>
              </label>
              <input
                id="plan-installments"
                type="number"
                min="0"
                value={installmentsCount}
                onChange={(e) => setInstallmentsCount(e.target.value)}
                placeholder="12"
                className="w-full bg-midnight-soft border border-hairline text-sm text-ink px-3 py-2 placeholder:text-zinc-600 outline-none focus:border-hairline-strong transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-950/30 border border-red-900/50 px-3 py-2">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => { resetForm(); onOpenChange(false) }}
              className="px-4 py-2 text-xs font-semibold text-ink-soft hover:text-ink border border-hairline bg-transparent cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="btn-primary text-xs font-bold px-4 py-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? "Creating..." : "Create plan"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
