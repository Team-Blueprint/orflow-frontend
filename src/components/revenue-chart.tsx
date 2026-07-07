import { useMemo, useState, useRef, useCallback } from "react"
import type { RevenueDataPoint } from "@/api/types/analytics"
import { formatNaira } from "@/lib/currency"

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

function labelForLength(n: number) {
  if (n <= 2) return "date"
  if (n <= 14) return "weekday"
  return "date"
}

function formatXLabel(dateStr: string, mode: "date" | "weekday") {
  const d = new Date(dateStr)
  if (mode === "weekday") {
    return d.toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)
  }
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

function formatDateFull(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const CHART_WIDTH = 720
const CHART_HEIGHT = 240
const PADDING = { top: 16, right: 16, bottom: 32, left: 48 }
const PLOT_W = CHART_WIDTH - PADDING.left - PADDING.right
const PLOT_H = CHART_HEIGHT - PADDING.top - PADDING.bottom

function RevenueChart({ data }: RevenueChartProps) {
  const labelMode = useMemo(() => labelForLength(data.length), [data.length])
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })
  const svgRef = useRef<SVGSVGElement>(null)

  const visibleLabels = useMemo(() => {
    const total = data.length
    if (total <= 14) return data
    const step = Math.ceil(total / 7)
    return data.filter((_, i) => i % step === 0 || i === total - 1)
  }, [data])

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<SVGSVGElement>) => {
      const svg = svgRef.current
      if (!svg) return
      const rect = svg.getBoundingClientRect()
      const scaleX = rect.width / CHART_WIDTH
      const mousePlotX = (e.clientX - rect.left) / scaleX - PADDING.left
      const idx = Math.round((mousePlotX / PLOT_W) * (data.length - 1))
      const clamped = Math.max(0, Math.min(data.length - 1, idx))
      setHoveredIdx(clamped)
      setTooltipPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [data.length],
  )

  const handleMouseLeave = useCallback(() => {
    setHoveredIdx(null)
  }, [])

  const hovered = hoveredIdx !== null && hoveredIdx < data.length ? data[hoveredIdx] : null

  if (data.length === 0) {
    return (
      <div className="border border-hairline bg-paper p-4 sm:p-5 flex items-center justify-center h-56">
        <p className="text-xs text-ink-soft">No revenue data yet</p>
      </div>
    )
  }

  if (data.length === 1) {
    const pt = data[0]
    return (
      <div className="border border-hairline bg-paper p-4 sm:p-5 flex items-center justify-center h-56">
        <p className="text-3xl font-bold tabular-nums text-ink">
          {formatNaira(pt.revenue)}
        </p>
      </div>
    )
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue))

  const xScale = (_: number, i: number) =>
    PADDING.left + (i / (data.length - 1)) * PLOT_W
  const yScale = (v: number) =>
    PADDING.top + PLOT_H - (v / maxRevenue) * PLOT_H

  const points = data.map((d, i) => `${xScale(0, i)},${yScale(d.revenue)}`).join(" ")
  const areaBase = PADDING.top + PLOT_H
  const areaPoints = `${xScale(0, 0)},${areaBase} ${points} ${xScale(0, data.length - 1)},${areaBase}`

  const yTicks = 4
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxRevenue / yTicks) * i),
  )

  return (
    <div className="border border-hairline bg-paper p-4 sm:p-5 relative select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <defs>
          <linearGradient id="revenue-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
          </linearGradient>
        </defs>

        {yTickValues.map((val) => (
          <g key={val}>
            <text
              x={PADDING.left - 8}
              y={yScale(val)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-zinc-500 text-[10px] font-mono"
            >
              {val >= 1_000_000 ? `${(val / 1_000_000).toFixed(1)}M` : val >= 1_000 ? `${(val / 1_000).toFixed(0)}k` : val}
            </text>
            <line
              x1={PADDING.left}
              y1={yScale(val)}
              x2={CHART_WIDTH - PADDING.right}
              y2={yScale(val)}
              stroke="#27272a"
              strokeWidth="1"
            />
          </g>
        ))}

        <polygon points={areaPoints} fill="url(#revenue-fill)" />

        <polyline
          points={points}
          fill="none"
          stroke="#f97316"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {data.map((d, i) => (
          <circle
            key={d.date}
            cx={xScale(0, i)}
            cy={yScale(d.revenue)}
            r={hoveredIdx === i ? 5 : 3}
            fill="#f97316"
            className="transition-all duration-100"
          />
        ))}

        {visibleLabels.map((d) => {
          const idx = data.findIndex((p) => p.date === d.date)
          return (
            <text
              key={d.date}
              x={xScale(0, idx)}
              y={CHART_HEIGHT - 6}
              textAnchor="middle"
              className="fill-zinc-600 text-[9px] font-mono"
            >
              {formatXLabel(d.date, labelMode)}
            </text>
          )
        })}
      </svg>

      {hovered && (
        <div
          className="pointer-events-none absolute z-10 bg-zinc-900 border border-zinc-700 px-3 py-2 shadow-lg"
          style={{
            left: tooltipPos.x,
            top: tooltipPos.y - 12,
            transform: "translate(-50%, -100%)",
          }}
        >
          <p className="text-[11px] text-zinc-400 whitespace-nowrap">{formatDateFull(hovered.date)}</p>
          <p className="text-sm font-semibold text-ink tabular-nums mt-0.5">
            {formatNaira(hovered.revenue)}
          </p>
          <p className="text-[11px] text-zinc-500 whitespace-nowrap">{hovered.volume} transactions</p>
        </div>
      )}
    </div>
  )
}

export { RevenueChart }
