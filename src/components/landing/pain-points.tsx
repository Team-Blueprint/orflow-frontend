import { useRef, useState, useEffect } from "react"
import { WebhookIcon } from "@/components/icons"
import { Shuffle, Refresh, Bill } from "@/lib/icons"

const painPoints = [
  {
    icon: Shuffle,
    title: "Proration",
    description: "Upgrades and downgrades mid-cycle. Calculate partial charges correctly so nobody gets overcharged or undercharged.",
  },
  {
    icon: Refresh,
    title: "Dunning",
    description: "Cards decline. Retry on day 1, 3, and 7 with escalating notifications before access is revoked.",
  },
  {
    icon: Bill,
    title: "Failed payment recovery",
    description: "No manual reconciliation. Automated retries plus webhooks so you know exactly what happened.",
  },
  {
    icon: WebhookIcon,
    title: "Outbound webhooks",
    description: "Every billing event — new subscriber, payment success, failure, cancellation — fires in real time.",
  },
]

export function PainPoints() {
  const ref = useRef<HTMLElement>(null)
  const [entered, setEntered] = useState(false)
  const [bordersVisible, setBordersVisible] = useState(false)
  const [contentVisible, setContentVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!entered) return
    const t1 = setTimeout(() => setBordersVisible(true), 50)
    const t2 = setTimeout(() => setContentVisible(true), 500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [entered])

  return (
    <section
      ref={ref}
      className="w-full bg-zinc-950 border-b border-zinc-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div
          className="text-center max-w-2xl mx-auto mb-16"
          style={{
            opacity: contentVisible ? 1 : 0,
            transition: "opacity 0.6s ease-out",
            transitionDelay: "0.3s",
          }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            Subscriptions are harder than they seem...
          </h2>
          <p className="text-zinc-500 text-base">
            The problems you&rsquo;d otherwise have to solve yourself.
          </p>
        </div>

        <div className="relative">
          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2">
            {painPoints.map((p, i) => (
              <div
                key={p.title}
                className="group relative p-8 border-b border-zinc-800/40 md:border-r even:md:border-r-0 transition-colors duration-500 hover:border-zinc-700"
                style={{
                  opacity: contentVisible ? 1 : 0,
                  transition: `opacity 0.5s ease-out ${i * 75}ms, border-color 0.5s ease-out`,
                }}
              >
                <span className="absolute top-6 right-6 text-7xl leading-none font-bold tracking-tight select-none pointer-events-none transition-colors duration-300 text-zinc-700/40 group-hover:text-zinc-700">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex h-10 w-10 items-center justify-center bg-orange-500/10 transition-all duration-200 ease-out group-hover:scale-[1.03]">
                  <p.icon className="text-orange-500" size={20} />
                </div>

                <h3 className="mt-5 text-base font-bold text-white">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-md">
                  {p.description}
                </p>
              </div>
            ))}
          </div>

          {/* Center crosshair dividers (desktop only) */}
          <div
            className="absolute inset-0 pointer-events-none hidden md:block"
            aria-hidden="true"
          >
            {/* Vertical divider */}
            <div
              className="absolute left-1/2 top-0 -translate-x-px bg-zinc-800/40"
              style={{
                width: 1,
                height: bordersVisible ? "100%" : "0%",
                transition: "height 0.5s ease-out",
                transitionDelay: "0.1s",
                transformOrigin: "center",
              }}
            />
            {/* Horizontal divider */}
            <div
              className="absolute top-1/2 left-0 -translate-y-px bg-zinc-800/40"
              style={{
                height: 1,
                width: bordersVisible ? "100%" : "0%",
                transition: "width 0.5s ease-out",
                transitionDelay: "0.1s",
                transformOrigin: "center",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
