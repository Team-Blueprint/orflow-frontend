import { motion } from "motion/react"
import { ShieldCheck, Card2, Key, Lock } from "@/lib/icons"
import { fadeUp, stagger } from "./animations"

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
