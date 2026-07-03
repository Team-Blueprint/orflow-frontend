import type { Variants } from "motion/react"

export const ease = [0.32, 0.72, 0, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } },
}

export const stagger: Variants = {
  visible: { transition: { staggerChildren: 0.06 } },
}

export const bScale = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } }
