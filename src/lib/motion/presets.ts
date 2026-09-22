import type { Transition, Variants } from 'framer-motion'

export const motionTransition: Transition = {
  duration: 0.35,
  ease: [0.22, 0.61, 0.36, 1]
}

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 }
}

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 }
  }
}
