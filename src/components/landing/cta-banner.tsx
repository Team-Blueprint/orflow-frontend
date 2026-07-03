import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { fadeUp, bScale } from "./animations";

export function CtaBanner() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className="w-full bg-zinc-950 border-b border-zinc-800/60"
    >
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
              <a href="/sign-up">Get started</a>
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
  );
}
