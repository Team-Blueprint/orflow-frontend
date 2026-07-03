import { useState } from "react"
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { fadeUp, stagger, bScale } from "./animations"

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
