import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { fadeUp, stagger } from "./animations";

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
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-300"
            >
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-300"
            >
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
              <line x1="1" y1="10" x2="23" y2="10" />
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-300"
            >
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-300"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="font-sans text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.1] max-w-3xl mb-6"
          >
            Recurring billing for{" "}
            <span className="font-serif italic text-primary">
              Nomba merchants.
            </span>{" "}
            No rebuild required.
          </motion.h1>

          <motion.p
            variants={fadeUp}
            className="font-sans text-base sm:text-lg text-ink-soft max-w-2xl mx-auto leading-relaxed mb-10"
          >
            Define a plan, tokenize a card, and let Orflow handle charges,
            proration, dunning, and webhooks — so you can build your product
            instead of building billing infrastructure.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button asChild className="text-xs font-bold px-5 py-2.5 h-auto">
              <a href="/sign-up">Start building</a>
            </Button>
            <a
              href="#docs"
              className="border border-hairline text-ink-soft hover:text-white px-5 py-2.5 text-xs font-medium transition-colors cursor-pointer"
            >
              Read the docs →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
