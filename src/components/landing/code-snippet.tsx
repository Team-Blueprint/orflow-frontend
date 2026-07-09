import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Highlight, themes } from "prism-react-renderer"
import { fadeUp, stagger, bScale } from "./animations"

const codeSnippets = {
  curl: `# Create a monthly plan
curl -X POST https://orflow-backend.onrender.com/plans \\
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
curl -X POST https://orflow-backend.onrender.com/checkouts \\
  -H "Authorization: Bearer sk_..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "plan_id": "plan_abc123",
    "customer_email": "user@example.com"
  }'

# Orflow handles recurring charges, proration, dunning & webhooks`,
  python: `import requests

api = "https://orflow-backend.onrender.com"
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
  javascript: `const api = "https://orflow-backend.onrender.com"
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
const langMap = { javascript: "jsx", python: "python", curl: "bash" } as const

const codeTheme = {
  ...themes.nightOwl,
  plain: { ...themes.nightOwl.plain, backgroundColor: "transparent" },
}

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
              href="/api-reference"
              className="inline-flex items-center text-sm text-orange-500 font-semibold hover:text-orange-600 transition-colors cursor-pointer"
            >
              View API reference →
            </motion.a>
          </motion.div>

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
