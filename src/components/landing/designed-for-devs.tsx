import { useState, useCallback } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Highlight, themes } from "prism-react-renderer"
import { fadeUp, stagger, bScale } from "./animations"

const devResources = [
  {
    label: "Documentation",
    href: "/docs",
    desc: "Read our guides and API docs",
    code: `# Quick start — create a plan
curl -X POST https://orflow-backend.onrender.com/v1/plans/create \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{"name":"Starter","amount":1999,"currency":"NGN","interval":"monthly"}'

# Generate a checkout for your customer
curl -X POST https://orflow-backend.onrender.com/v1/checkouts \\
  -H "Authorization: Bearer sk_..." \\
  -d '{"plan_id":"plan_abc123","customer_email":"user@example.com"}'

# Handle events via webhook
# POST /webhooks — payment_success, payment_failure, subscription_canceled

# Full docs at /docs`,
  },
  {
    label: "API Reference",
    href: "/api-reference",
    desc: "Explore every endpoint and schema",
    code: `# Create a plan
curl -X POST https://orflow-backend.onrender.com/v1/plans/create \\
  -H "Authorization: Bearer sk_..." \\
  -d '{"name":"Pro","amount":2999,"currency":"NGN","interval":"monthly"}'

# Generate a checkout link
curl -X POST https://orflow-backend.onrender.com/v1/checkouts \\
  -H "Authorization: Bearer sk_..." \\
  -d '{"plan_id":"plan_abc123","customer_email":"user@example.com"}'

# Orflow handles the rest
# Nomba checkout → tokenize → recurring → webhooks`,
  },
  {
    label: "GitHub",
    href: "https://github.com/Team-Blueprint/orflow-backend",
    desc: "Open-source backend",
    code: `# Clone the repository
git clone https://github.com/Team-Blueprint/orflow-backend.git

# Install dependencies
cd orflow-backend && pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start the development server
uvicorn app.main:app --reload --port 8000`,
  },
]

const codeTheme = {
  ...themes.nightOwl,
  plain: { ...themes.nightOwl.plain, backgroundColor: "transparent" },
}

export function DesignedForDevs() {
  const [activeTab, setActiveTab] = useState(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(devResources[activeTab].code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }, [activeTab])

  return (
    <motion.section
      id="developers"
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
          <motion.div variants={fadeUp} className="lg:col-span-8 flex flex-col">
            {/* IDE Terminal window shell */}
            <div className="border border-zinc-800 bg-zinc-950 overflow-hidden flex flex-col">
              {/* Terminal window header */}
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500" />
                  <span className="w-3 h-3 bg-amber-400" />
                  <span className="w-3 h-3 bg-emerald-500" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-zinc-600">
                    {devResources[activeTab].label === "GitHub" ? "terminal" : "bash"}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
                    aria-label="Copy code"
                  >
                    {copied ? (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-500">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                        </svg>
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
              {/* Code content */}
              <div className="p-5 overflow-x-auto">
                <Highlight code={devResources[activeTab].code} language="bash" theme={codeTheme}>
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
              </div>
            </div>
            {/* Bottom row: action links */}
            <div className="flex items-center gap-4 mt-4">
              {devResources[activeTab].href.startsWith("http") ? (
                <a
                  href={devResources[activeTab].href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors cursor-pointer"
                >
                  Open {devResources[activeTab].label} →
                </a>
              ) : (
                <a
                  href={devResources[activeTab].href}
                  className="text-xs text-orange-500 hover:text-orange-400 font-medium transition-colors cursor-pointer"
                >
                  Open {devResources[activeTab].label} →
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}
