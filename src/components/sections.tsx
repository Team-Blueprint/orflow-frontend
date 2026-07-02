import { useState, useRef, useEffect } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { WebhookIcon } from "@/components/icons"
import { Highlight, themes } from "prism-react-renderer"
import { Button } from "@/components/ui/button"
import {
  Shuffle,
  Refresh,
  Bill,
  ShieldCheck,
  Card2,
  Key,
  Lock,
  AltArrowDown,
} from "@/lib/icons"

const ease = [0.32, 0.72, 0, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.06 } },
}

const bScale = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } }

const codeTheme = {
  ...themes.nightOwl,
  plain: { ...themes.nightOwl.plain, backgroundColor: "transparent" },
}

const langMap = { javascript: "jsx", python: "python", curl: "bash" } as const

export function Hero() {
  return (
    <section className="relative w-full bg-zinc-950 border-b border-zinc-800/60 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(249,115,22,0.12),transparent_70%)]" />
      </div>

      <div className="relative min-h-[85vh] flex flex-col items-center justify-center text-center max-w-4xl mx-auto px-4 pt-16 pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="flex flex-col items-center"
        >
          <motion.div
            variants={fadeUp}
            className="flex justify-center items-center gap-5 opacity-30 grayscale mb-8"
            aria-hidden="true"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-zinc-300">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl mb-6"
          >
            Recurring billing for{" "}
            <span className="font-serif italic text-primary">Nomba merchants.</span>
            {" "}No rebuild required.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-sans text-base sm:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Define a plan, tokenize a card, and let Orflow handle charges, proration, dunning,
            and webhooks — so you can build your product instead of billing infrastructure.
          </motion.p>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild className="text-xs font-bold px-5 py-2.5 h-auto">
              <a href="#discover">Start building</a>
            </Button>
            <a
              href="#docs"
              className="border border-hairline text-ink-soft hover:text-white px-5 py-2.5 text-xs font-medium transition-colors cursor-pointer"
            >
              Read the docs &rarr;
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}



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
  return (
    <motion.section
      id="discover"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      className="w-full bg-zinc-950 border-b border-zinc-800/60"
    >
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-white mb-3">
            Subscriptions are harder than they seem...
          </h2>
          <p className="text-zinc-500 text-base">
            The problems you&rsquo;d otherwise have to solve yourself.
          </p>
        </div>
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 md:grid-cols-2"
        >
          {painPoints.map((p, i) => (
            <motion.div
              key={p.title}
              variants={fadeUp}
              className="relative p-8 border-b border-zinc-800/40 md:border-r even:border-r-0"
            >
              <span className="absolute top-6 right-6 text-7xl leading-none font-bold text-zinc-700/40 tracking-tight select-none pointer-events-none">
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="flex h-10 w-10 items-center justify-center bg-orange-500/10">
                <p.icon className="text-orange-500" size={20} />
              </div>

              <h3 className="mt-5 text-base font-bold text-white">
                {p.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed max-w-md">
                {p.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}

const codeSnippets = {
  curl: `# Create a monthly plan
curl -X POST https://api.orflow.io/plans \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Pro",
    "amount": 2999,
    "currency": "NGN",
    "interval": "monthly",
    "trial_days": 7
  }'

# Generate a checkout link (card tokenized via Nomba)
curl -X POST https://api.orflow.io/checkouts \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "plan_id": "plan_abc123",
    "customer_email": "user@example.com"
  }'

# Orflow handles recurring charges, proration, dunning & webhooks`,
  python: `import requests

api = "https://api.orflow.io"
headers = {"Authorization": "Bearer sk_..."}

# Create a monthly plan
plan = requests.post(f"{api}/plans", headers=headers, json={
    "name": "Pro",
    "amount": 2999,
    "currency": "NGN",
    "interval": "monthly",
    "trial_days": 7,
}).json()

# Generate a checkout link
checkout = requests.post(f"{api}/checkouts", headers=headers, json={
    "plan_id": plan["id"],
    "customer_email": "user@example.com",
}).json()

print(checkout["url"])`,
  javascript: `const api = "https://api.orflow.io"
const headers = {
  Authorization: "Bearer sk_...",
  "Content-Type": "application/json",
}

// Create a monthly plan
const plan = await fetch(\`\${api}/plans\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    name: "Pro",
    amount: 2999,
    currency: "NGN",
    interval: "monthly",
    trial_days: 7,
  }),
}).then((r) => r.json())

// Generate a checkout link
const checkout = await fetch(\`\${api}/checkouts\`, {
  method: "POST",
  headers,
  body: JSON.stringify({
    plan_id: plan.id,
    customer_email: "user@example.com",
  }),
}).then((r) => r.json())

console.log(checkout.url)`,
}

type Lang = keyof typeof codeSnippets
const langLabels: Record<Lang, string> = { curl: "cURL", python: "Python", javascript: "JavaScript" }

export function CodeSnippet() {
  const [lang, setLang] = useState<Lang>("javascript")

  return (
    <motion.section
      id="docs"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      className="w-full bg-white border-b border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
        >
          {/* Left */}
          <motion.div variants={fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">
              API First
            </p>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">
              Integrate with just a few lines of code
            </h2>
            <p className="text-zinc-500 text-base mb-6 leading-relaxed">
              A complete subscription flow in three API calls. Create a plan, generate a checkout link, and Orflow handles the rest.
            </p>
            <motion.a
              {...bScale}
              href="#"
              className="inline-flex items-center text-sm text-orange-500 font-semibold hover:text-orange-600 transition-colors cursor-pointer"
            >
              View API reference →
            </motion.a>
          </motion.div>

          {/* Right — code block */}
          <motion.div variants={fadeUp} className="border border-zinc-800 bg-zinc-950 overflow-hidden">
            <div className="flex items-center gap-1 border-b border-zinc-800 px-4">
              {(Object.keys(codeSnippets) as Lang[]).map((l) => (
                <motion.button
                  key={l}
                  {...bScale}
                  onClick={() => setLang(l)}
                  className={cn(
                    "cursor-pointer px-3 py-3 text-xs font-medium transition-colors duration-150",
                    lang === l
                      ? "text-orange-500 border-b-2 border-orange-500"
                      : "text-zinc-500 hover:text-zinc-300",
                  )}
                >
                  {langLabels[l]}
                </motion.button>
              ))}
            </div>
            <div className="p-5 overflow-x-auto leading-6 max-h-72 overflow-y-auto">
              <Highlight code={codeSnippets[lang]} language={langMap[lang]} theme={codeTheme}>
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre className={cn("m-0 font-mono text-xs", className)} style={style}>
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
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

const consoleCards = [
  {
    title: "A great experience for your customers",
    description: "Self-service portal to manage subscriptions, update payment methods, pause or cancel — without emailing you.",
  },
  {
    title: "Fast time to market",
    description: "One API call to create a plan. One checkout to tokenize a card. No billing infrastructure to build from scratch.",
  },
  {
    title: "A solution that grows with you",
    description: "From 10 subscribers to 10,000 — proration, dunning, and webhooks scale automatically on Nomba's primitives.",
  },
]

export function ConsoleSplit() {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      className="w-full bg-zinc-950 border-b border-zinc-800/60"
    >
      <motion.div
        variants={stagger}
        className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
      >
        {/* Left: feature list */}
        <motion.div variants={fadeUp} className="flex flex-col gap-3">
          <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">
            Merchant Dashboard
          </p>
          <h2 className="text-3xl font-bold text-white mb-4">
            Everything you need to manage subscriptions
          </h2>
          {consoleCards.map((card, i) => (
            <motion.button
              key={card.title}
              {...bScale}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "w-full text-left border p-5 transition-all duration-150 cursor-pointer",
                activeIndex === i
                  ? "border-orange-500/50 bg-zinc-900/60"
                  : "border-zinc-800/60 bg-transparent hover:border-zinc-700",
              )}
            >
              <h3 className={cn("text-sm font-semibold transition-colors", activeIndex === i ? "text-white" : "text-zinc-400")}>
                {card.title}
              </h3>
              {activeIndex === i && (
                <p className="mt-2 text-xs leading-relaxed text-zinc-400">{card.description}</p>
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Right: mock dashboard */}
        <motion.div variants={fadeUp} className="border border-zinc-800 bg-zinc-900/50 p-5 aspect-[4/3] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
              <div className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
            </div>
            <span className="text-xs text-zinc-600 font-mono ml-2">merchant.orflow.io/dashboard</span>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-3">
            <div className="border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between">
              <span className="text-xs text-zinc-500 font-medium">Active Subscribers</span>
              <span className="text-3xl font-bold text-white mt-2">2,847</span>
              <span className="text-xs text-emerald-500 mt-1">↑ 12% this month</span>
            </div>
            <div className="border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between">
              <span className="text-xs text-zinc-500 font-medium">Monthly Revenue</span>
              <span className="text-3xl font-bold text-white mt-2">₦8.4M</span>
              <span className="text-xs text-emerald-500 mt-1">↑ 8% this month</span>
            </div>
            <div className="border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between">
              <span className="text-xs text-zinc-500 font-medium">Failed Payments</span>
              <span className="text-3xl font-bold text-white mt-2">23</span>
              <span className="text-xs text-amber-500 mt-1">3% failure rate</span>
            </div>
            <div className="border border-zinc-800 bg-zinc-950/60 p-4 flex flex-col justify-between">
              <span className="text-xs text-zinc-500 font-medium">Active Plans</span>
              <span className="text-3xl font-bold text-white mt-2">12</span>
              <span className="text-xs text-zinc-500 mt-1">3 tiers · 4 currencies</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  )
}

const devResources = [
  { label: "Documentation", href: "/docs", desc: "Read our guides and API docs" },
  { label: "API Reference", href: "#", desc: "Explore every endpoint and schema" },
  { label: "GitHub", href: "https://github.com/Team-Blueprint/orflow-backend", desc: "Open-source backend" },
  { label: "Status", href: "#", desc: "API uptime and incidents" },
]

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

const securityBadges = [
  { icon: ShieldCheck, label: "PCI-DSS Compliant", desc: "Via Nomba's payment infrastructure" },
  { icon: Card2, label: "Tokenized Cards", desc: "Card data never touches your servers" },
  { icon: Key, label: "Signed Webhooks", desc: "HMAC-SHA256 verification" },
  { icon: Lock, label: "Scoped API Keys", desc: "Granular permission model" },
]

export function Security() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={fadeUp}
      className="w-full bg-white border-b border-zinc-200"
    >
      <div className="max-w-7xl mx-auto px-6 py-20">
        <motion.div
          variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp}>
            <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-3">Compliance</p>
            <h2 className="text-3xl font-bold text-zinc-900 mb-4">Security &amp; compliance</h2>
            <p className="text-zinc-500 text-base leading-relaxed">
              Built on Nomba's battle-tested payment infrastructure. Orflow inherits enterprise-grade security so you don't have to think about it.
            </p>
          </motion.div>
          <motion.div variants={stagger} className="grid grid-cols-2 gap-4">
            {securityBadges.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeUp}
                className="border border-zinc-200 bg-zinc-50 p-5 flex flex-col items-start"
              >
                <s.icon className="text-orange-500" size={22} />
                <h3 className="mt-3 text-sm font-semibold text-zinc-900">{s.label}</h3>
                <p className="mt-1 text-xs text-zinc-500">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

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
            {integrations.map((card, i) => (
              <motion.div
                key={card.title}
                variants={fadeUp}
                className={`group bento-card ${card.rotation} flex flex-col border border-zinc-800/60 bg-zinc-950`}
              >
                {/* Canvas viewport */}
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
                {/* Content */}
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

export function CtaBanner() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="w-full bg-zinc-950 border-b border-zinc-800/60"
    >
      {/* Inner gradient card */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-orange-950/40 border border-zinc-800 px-10 py-16 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-900/20 via-transparent to-transparent pointer-events-none" />
          <h2 className="relative text-4xl font-bold text-white mb-4">
            Start building on Orflow
          </h2>
          <p className="relative text-zinc-400 mb-8 max-w-md mx-auto">
            One API. Nomba&rsquo;s infrastructure. Your product, shipped.
          </p>
          <div className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button asChild className="text-sm font-semibold px-7 py-3 h-auto">
              <a href="#">Get started</a>
            </Button>
            <motion.a
              {...bScale}
              href="/docs"
              className="border border-zinc-700 text-zinc-300 px-5 py-3 text-sm font-medium transition-colors duration-150 hover:bg-zinc-800/50 cursor-pointer"
            >
              Read the docs →
            </motion.a>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

const faqItems = [
  {
    q: "What is Orflow?",
    a: "Orflow is a managed recurring billing API built on Nomba's payment primitives. It handles plan management, card tokenization, scheduled charges, proration, dunning, and outbound webhooks — so you don't have to build billing infrastructure from scratch.",
  },
  {
    q: "How does Orflow work with Nomba?",
    a: "Orflow uses Nomba Checkout to capture and tokenize cards on first payment, Nomba's Tokenized Card API for recurring charges, and Nomba Webhooks to receive real-time payment events that drive subscription state transitions.",
  },
  {
    q: "What happens when a payment fails?",
    a: "Orflow's dunning engine retries on day 1, day 3, and day 7 with escalating customer notifications. After the final failed attempt, the subscription is automatically suspended and a webhook is fired.",
  },
  {
    q: "Does Orflow store my customers' card data?",
    a: "No. Card data is tokenized via Nomba and never touches your servers. Orflow stores only the tokenKey returned by Nomba, which is used to execute subsequent charges.",
  },
  {
    q: "Is there a merchant dashboard?",
    a: "Yes. Every Orflow account ships with a dashboard for managing plans, viewing subscribers, monitoring billing history, configuring webhooks, and updating settings.",
  },
  {
    q: "How do I get started?",
    a: "Sign up for an account, create a plan via the API or dashboard, generate a checkout link, and your first subscriber is live. No lengthy onboarding required.",
  },
]

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeUp}
      className="w-full bg-white border-b border-zinc-200"
    >
      <div className="max-w-3xl mx-auto px-6 py-24">
        <h2 className="text-center text-3xl font-bold text-zinc-900 mb-12">
          Frequently asked questions
        </h2>
        <motion.div variants={stagger} className="space-y-0">
          {faqItems.map((item, i) => (
            <motion.div key={i} variants={fadeUp} className="border-b border-zinc-200 py-5">
              <motion.button
                {...bScale}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex justify-between items-center cursor-pointer text-zinc-800 font-medium text-left hover:text-zinc-900 transition-colors duration-150"
              >
                <span className="text-sm">{item.q}</span>
                <AltArrowDown
                  size={16}
                  className={cn(
                    "shrink-0 text-zinc-400 transition-transform duration-150 ml-4",
                    openIndex === i && "rotate-180",
                  )}
                />
              </motion.button>
              {openIndex === i && (
                <div className="mt-3 pr-8">
                  <p className="text-sm text-zinc-500 leading-relaxed">{item.a}</p>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
