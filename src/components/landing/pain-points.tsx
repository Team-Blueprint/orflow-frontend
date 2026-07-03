import { useRef, useEffect } from "react"
import { WebhookIcon } from "@/components/icons"
import { Shuffle, Refresh, Bill } from "@/lib/icons"

const painPoints = [
  { icon: Shuffle, title: "Proration", description: "Upgrades and downgrades mid-cycle. Calculate partial charges correctly so nobody gets overcharged or undercharged." },
  { icon: Refresh, title: "Dunning", description: "Cards decline. Retry on day 1, 3, and 7 with escalating notifications before access is revoked." },
  { icon: Bill, title: "Failed payment recovery", description: "No manual reconciliation. Automated retries plus webhooks so you know exactly what happened." },
  { icon: WebhookIcon, title: "Outbound webhooks", description: "Every billing event — new subscriber, payment success, failure, cancellation — fires in real time." },
]

const delays = ["delay-0", "delay-75", "delay-150", "delay-225"]

export function PainPoints() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.revealed = ""
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      id="discover"
      className="group/section w-full bg-zinc-950 border-b border-zinc-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div
          className="text-center max-w-2xl mx-auto mb-16 opacity-0 transition-all duration-700 ease-out group-data-[revealed]/section:opacity-100"
          style={{ transitionDelay: "0.1s" }}
        >
          <h2 className="text-3xl font-bold text-white mb-3">
            Subscriptions are harder than they seem...
          </h2>
          <p className="text-zinc-500 text-base">
            The problems you&rsquo;d otherwise have to solve yourself.
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {painPoints.map((p, i) => (
              <div
                key={p.title}
                className={`group relative p-8 border-b border-zinc-800/40 md:border-r even:md:border-r-0 opacity-0 transition-all duration-500 ease-out group-data-[revealed]/section:opacity-100 hover:bg-zinc-900/20 hover:border-zinc-800 ${delays[i]}`}
              >
                <span className="absolute top-6 right-6 text-7xl leading-none font-bold tracking-tight select-none pointer-events-none transition-colors duration-300 text-zinc-700/40 group-hover:text-zinc-700">
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div className="flex h-10 w-10 items-center justify-center bg-orange-500/10 transition-transform duration-200 ease-out group-hover:scale-[1.03]">
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

          <div className="absolute inset-0 pointer-events-none hidden md:block" aria-hidden="true">
            <div
              className="absolute left-1/2 top-0 -translate-x-px bg-zinc-800/40 w-px h-0 transition-all duration-500 ease-out group-data-[revealed]/section:h-full"
              style={{ transitionDelay: "0.1s" }}
            />
            <div
              className="absolute top-1/2 left-0 -translate-y-px bg-zinc-800/40 h-px w-0 transition-all duration-500 ease-out group-data-[revealed]/section:w-full"
              style={{ transitionDelay: "0.1s" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
