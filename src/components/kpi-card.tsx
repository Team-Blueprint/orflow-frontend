import { cn } from "@/lib/utils"

interface KPICardProps {
  label: string
  value: string
  variant?: "default" | "success" | "destructive"
}

function KPICard({ label, value, variant = "default" }: KPICardProps) {
  const colorClass =
    variant === "success"
      ? "text-emerald-500"
      : variant === "destructive"
        ? "text-red-500"
        : "text-ink"

  return (
    <div className="border border-hairline bg-paper p-4 sm:p-5">
      <p className="text-xs sm:text-sm text-ink-soft">{label}</p>
      <p className={cn("mt-1.5 text-xl sm:text-2xl font-semibold tabular-nums tracking-tight", colorClass)}>
        {value}
      </p>
    </div>
  )
}

export { KPICard }
