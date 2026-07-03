import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Highlight, themes } from "prism-react-renderer"
import { fadeUp, stagger, bScale } from "./animations"

const devResources = [
  { label: "Documentation", href: "/docs", desc: "Read our guides and API docs" },
  { label: "API Reference", href: "#", desc: "Explore every endpoint and schema" },
  { label: "GitHub", href: "https://github.com/Team-Blueprint/orflow-backend", desc: "Open-source backend" },
  { label: "Status", href: "#", desc: "API uptime and incidents" },
]

const codeTheme = {
  ...themes.nightOwl,
  plain: { ...themes.nightOwl.plain, backgroundColor: "transparent" },
}

export function DesignedForDevs() {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      className="w-full bg-zinc-950 border-b border-zinc-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Developer Experience</p>
          <h2 className="text-3xl font-bold text-white">Designed for <span className="font-serif italic text-primary">developers</span></h2>
        </div>
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch"
        >
          <motion.div variants={fadeUp} className="lg:col-span-4 flex flex-col gap-2">
              {devResources.map((r, i) => (
                <motion.button
                  key={r.label}
                  {...bScale}
                  onClick={() => setActiveTab(i)}
                  className={cn(
                    "group w-full text-left border p-5 transition-all duration-150 cursor-pointer",
                    activeTab === i
                      ? "border-orange-500/50 bg-zinc-900/40"
                      : "border-zinc-800/60 bg-transparent hover:border-zinc-700",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className={cn("text-sm font-semibold transition-colors", activeTab === i ? "text-white" : "text-zinc-400")}>
                      {r.label}
                    </h3>
                    <svg
                      className={cn(
                        "h-4 w-4 shrink-0 transition-all duration-150",
                        activeTab === i ? "text-orange-500 translate-x-0.5" : "text-zinc-600 group-hover:text-zinc-400",
                      )}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <p className="mt-1 text-xs text-zinc-600">{r.desc}</p>
                </motion.button>
              ))}
          </motion.div>
          <motion.div variants={fadeUp} className="lg:col-span-8 border border-zinc-800 bg-zinc-900/30 p-6 overflow-x-auto">
            <Highlight code={`# 1. Create a plan
curl -X POST https://api.orflow.io/plans \\
  -H "Authorization: Bearer sk_..." \\
  -d '{"name":"Pro","amount":2999,"currency":"NGN","interval":"monthly"}'

# 2. Generate a checkout link
curl -X POST https://api.orflow.io/checkouts \\
  -H "Authorization: Bearer sk_..." \\
  -d '{"plan_id":"plan_abc123","customer_email":"user@example.com"}'

# 3. Orflow handles the rest
# Nomba checkout → tokenize → recurring charges → webhooks`} language="bash" theme={codeTheme}>
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={cn("m-0 font-mono text-xs sm:text-sm leading-6", className)} style={style}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
