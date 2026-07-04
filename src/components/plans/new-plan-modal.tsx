import { useState, useRef, useEffect, type FormEvent } from "react"
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

function InfoTooltip({ text }: { text: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const tooltipRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <span ref={tooltipRef} className="relative group inline-flex items-center">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-zinc-500 cursor-help"
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
      <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 transition-opacity duration-150 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      } pointer-events-auto`}>
        <span className="bg-zinc-800 text-zinc-200 text-[11px] leading-relaxed px-4 py-3 border border-zinc-700 max-w-96 block text-center whitespace-normal shadow-lg">
          {text}
        </span>
      </span>
    </span>
  )
}

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
            <label htmlFor="plan-interval-count" className="text-xs font-semibold text-ink flex items-center gap-1.5">
              Interval count
              <InfoTooltip text="How many intervals between charges. E.g. 2 + monthly = billed every 2 months." />
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
              <label htmlFor="plan-trial" className="text-xs font-semibold text-ink flex items-center gap-1.5">
                Trial (days)
                <InfoTooltip text="Free trial period before the first charge. Leave empty for no trial." />
                <span className="text-ink-soft/60">opt</span>
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
              <label htmlFor="plan-installments" className="text-xs font-semibold text-ink flex items-center gap-1.5">
                Max payments
                <InfoTooltip text="Limits the total number of payments. Leave empty for unlimited (ongoing)." />
                <span className="text-ink-soft/60">opt</span>
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
