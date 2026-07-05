import type { RevenueDataPoint } from "@/api/types/analytics"

interface RevenueChartProps {
  data: RevenueDataPoint[]
}

function RevenueChart({ data }: RevenueChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 border border-hairline bg-paper">
        <p className="text-xs text-ink-soft">No revenue data yet</p>
      </div>
    )
  }

  const maxRevenue = Math.max(...data.map((d) => d.revenue))
    const chartWidth = 720
  const chartHeight = 240
  const padding = { top: 16, right: 16, bottom: 32, left: 48 }
  const plotW = chartWidth - padding.left - padding.right
  const plotH = chartHeight - padding.top - padding.bottom

  const xScale = (_: number, i: number) =>
    padding.left + (i / (data.length - 1)) * plotW
  const yScale = (v: number) =>
    padding.top + plotH - (v / maxRevenue) * plotH

  const points = data.map((d, i) => `${xScale(0, i)},${yScale(d.revenue)}`).join(" ")
  const areaBase = padding.top + plotH
  const areaPoints = `${xScale(0, 0)},${areaBase} ${points} ${xScale(0, data.length - 1)},${areaBase}`

  const yTicks = 4
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    Math.round((maxRevenue / yTicks) * i),
  )

  return (
    <div className="border border-hairline bg-paper p-4 sm:p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs sm:text-sm font-semibold text-ink tracking-tight">Revenue (last 7 days)</p>
      </div>
      <svg
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
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
              x={padding.left - 8}
              y={yScale(val)}
              textAnchor="end"
              dominantBaseline="middle"
              className="fill-zinc-500 text-[10px] font-mono"
            >
              {val >= 1_000_000 ? `${(val / 1_000_000).toFixed(1)}M` : val >= 1_000 ? `${(val / 1_000).toFixed(0)}k` : val}
            </text>
            <line
              x1={padding.left}
              y1={yScale(val)}
              x2={chartWidth - padding.right}
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
            r="3"
            fill="#f97316"
            className="hover:r-5 transition-all"
          />
        ))}

        {data.map((d, i) => (
          <text
            key={d.date}
            x={xScale(0, i)}
            y={chartHeight - 6}
            textAnchor="middle"
            className="fill-zinc-600 text-[9px] font-mono"
          >
            {new Date(d.date).toLocaleDateString("en-US", { weekday: "short" }).slice(0, 2)}
          </text>
        ))}
      </svg>
    </div>
  )
}

export { RevenueChart }
