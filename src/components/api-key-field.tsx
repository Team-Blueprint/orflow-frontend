import { useState } from "react"

interface ApiKeyFieldProps {
  label: string
  value: string
  prefix?: string
}

export function ApiKeyField({ label, value, prefix }: ApiKeyFieldProps) {
  const [revealed, setRevealed] = useState(false)
  const pfx = prefix ?? value.slice(0, value.indexOf("_") + 1)

  function copy() {
    navigator.clipboard.writeText(value)
  }

  const masked = revealed
    ? value
    : pfx + "•".repeat(Math.max(value.length - pfx.length, 8))

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-widest text-ink-soft">
        {label}
      </label>
      <div className="flex border border-hairline">
        <div className="flex-1 truncate bg-canvas px-3 py-2.5 font-mono text-xs text-ink select-all">
          {masked}
        </div>
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="cursor-pointer border-l border-hairline bg-midnight-soft px-3 text-xs font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
        >
          {revealed ? "Hide" : "Show"}
        </button>
        <button
          type="button"
          onClick={copy}
          className="cursor-pointer border-l border-hairline bg-midnight-soft px-3 text-xs font-medium text-ink-soft transition-colors duration-150 hover:text-ink"
        >
          Copy
        </button>
      </div>
    </div>
  )
}
