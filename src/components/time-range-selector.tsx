import { cn } from "@/lib/utils"

const OPTIONS = [
  { label: "24h", days: 1 },
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
] as const

interface TimeRangeSelectorProps {
  value: number
  onChange: (days: number) => void
}

function TimeRangeSelector({ value, onChange }: TimeRangeSelectorProps) {
  return (
    <div className="inline-flex border border-hairline bg-canvas">
      {OPTIONS.map((opt) => (
        <button
          key={opt.days}
          type="button"
          onClick={() => onChange(opt.days)}
          className={cn(
            "px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer",
            value === opt.days
              ? "bg-primary text-white"
              : "text-ink-soft hover:text-ink hover:bg-midnight-soft",
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export { TimeRangeSelector }
