import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { AltArrowDown } from "@/lib/icons"
import { fadeUp, stagger, bScale } from "./animations"

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
      id="faq"
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
