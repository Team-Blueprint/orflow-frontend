import { useRef, useState, useEffect } from "react"

export function Testimonial() {
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const quote =
    "We spent weeks integrating recurring payments for a client—retries, proration, dunning, all from scratch. Orflow is the layer we wished existed. We built it so nobody else has to."
  const words = quote.split(" ")

  return (
    <section
      ref={ref}
      className="w-full bg-zinc-950 border-b border-zinc-800/60"
    >
      <div className="max-w-4xl mx-auto px-6 py-24 text-left flex flex-col">
        <blockquote className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.2] max-w-4xl">
          <span className="text-zinc-700 select-none">&ldquo;</span>
          {words.map((word, i) => (
            <span
              key={i}
              className="inline-block mr-[0.3em] transition-all duration-700 ease-out"
              style={{
                color: inView ? "#fafafa" : "#27272a",
                opacity: inView ? 1 : 0.15,
                transitionDelay: `${i * 40}ms`,
              }}
            >
              {word}
            </span>
          ))}
          <span className="text-zinc-700 select-none">&rdquo;</span>
        </blockquote>
        <div
          className="mt-8 flex flex-col items-start"
          style={{
            opacity: inView ? 1 : 0,
            transition: "opacity 0.8s ease-out",
            transitionDelay: `${words.length * 40 + 300}ms`,
          }}
        >
          <p className="text-sm font-semibold text-zinc-400">Team Blueprint</p>
          <p className="text-xs text-zinc-600 mt-1">Orflow</p>
        </div>
      </div>
    </section>
  )
}
