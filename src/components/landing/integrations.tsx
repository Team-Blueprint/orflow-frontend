import { motion } from "motion/react"
import { fadeUp, stagger } from "./animations"

const integrations = [
  {
    title: "Nomba Checkout",
    desc: "Capture card with tokenizeCard: true on checkout",
    rotation: "rotate-[1deg]",
    floats: [
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-orange-500/15 border border-orange-500/30 text-orange-400 tracking-tight whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
            POST /checkouts
          </span>
        ),
        x: "12%", y: "15%", anim: "float-drift", dur: "4s",
      },
      {
        el: (
          <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 tracking-tight whitespace-nowrap">
            {`{ "tokenize": true }`}
          </span>
        ),
        x: "45%", y: "55%", anim: "float-shift", dur: "5s",
      },
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 tracking-tight whitespace-nowrap">
            <span className="text-emerald-400">→</span>
            201 Created
          </span>
        ),
        x: "60%", y: "25%", anim: "float-bob", dur: "3.5s",
      },
      {
        el: (
          <span className="inline-flex items-center px-2.5 py-1 text-[9px] font-mono bg-zinc-800/80 border border-zinc-700/50 text-zinc-400 tracking-tight whitespace-nowrap">
            ⚡ tok_test_...
          </span>
        ),
        x: "20%", y: "70%", anim: "float-drift", dur: "6s",
      },
    ],
  },
  {
    title: "Tokenized Card API",
    desc: "Execute recurring charges via saved tokenKey",
    rotation: "-rotate-[1deg]",
    floats: [
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 tracking-tight whitespace-nowrap">
            tokenKey: <span className="text-orange-400">tk_abc123</span>
          </span>
        ),
        x: "10%", y: "20%", anim: "float-shift", dur: "4.5s",
      },
      {
        el: (
          <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 tracking-tight whitespace-nowrap">
            {`{ "recurring": true }`}
          </span>
        ),
        x: "50%", y: "60%", anim: "float-bob", dur: "5s",
      },
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 tracking-tight whitespace-nowrap">
            ✓ 200 OK
          </span>
        ),
        x: "65%", y: "15%", anim: "float-drift", dur: "3s",
      },
    ],
  },
  {
    title: "Nomba Webhooks",
    desc: "Real-time payment_success / payment_failure events",
    rotation: "rotate-[2deg]",
    floats: [
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 tracking-tight whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            payment_success
          </span>
        ),
        x: "8%", y: "20%", anim: "float-drift", dur: "4s",
      },
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-red-500/15 border border-red-500/30 text-red-400 tracking-tight whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
            payment_failure
          </span>
        ),
        x: "55%", y: "50%", anim: "float-shift", dur: "5s",
      },
      {
        el: (
          <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-mono bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 tracking-tight whitespace-nowrap">
            {`{ "event": "payment_success" }`}
          </span>
        ),
        x: "25%", y: "70%", anim: "float-bob", dur: "4.5s",
      },
    ],
  },
  {
    title: "Recurring Engine",
    desc: "Scheduled charges with smart retry & dunning",
    rotation: "-rotate-[2deg]",
    floats: [
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-violet-500/15 border border-violet-500/30 text-violet-400 tracking-tight whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            cron: 0 0 1 * *
          </span>
        ),
        x: "10%", y: "15%", anim: "float-shift", dur: "4s",
      },
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 tracking-tight whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            active
          </span>
        ),
        x: "60%", y: "60%", anim: "float-drift", dur: "5.5s",
      },
      {
        el: (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono bg-amber-500/15 border border-amber-500/30 text-amber-400 tracking-tight whitespace-nowrap">
            retry #2
          </span>
        ),
        x: "35%", y: "30%", anim: "float-bob", dur: "3.5s",
      },
    ],
  },
]

export function Integrations() {
  return (
    <>
      <style>{`
        .bento-card:hover { --dur: 1.8s; }
      `}</style>
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={fadeUp}
        className="w-full bg-zinc-950 border-b border-zinc-800/60"
      >
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center mb-14">
            <h2 className="text-2xl font-bold text-white mb-3">How Orflow connects with Nomba</h2>
            <p className="text-zinc-500 text-sm">Four primitives. One subscription layer.</p>
          </div>
          <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {integrations.map((card) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                className={`group bento-card ${card.rotation} flex flex-col border border-zinc-800/60 bg-zinc-950`}
              >
                <div
                  className="relative h-44 overflow-hidden bg-zinc-900/30 border-b border-zinc-800/40"
                  style={{ contain: "strict" }}
                >
                  {card.floats.map((f, fi) => (
                    <span
                      key={fi}
                      className="absolute micro-float"
                      style={{
                        left: f.x,
                        top: f.y,
                        animationName: f.anim,
                        animationDuration: `var(--dur, ${f.dur})`,
                        animationTimingFunction: "ease-in-out",
                        animationIterationCount: "infinite",
                        animationDelay: `${fi * 0.3}s`,
                        willChange: "transform",
                      }}
                    >
                      {f.el}
                    </span>
                  ))}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                  <p className="mt-1 text-base text-zinc-500">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>
    </>
  )
}
