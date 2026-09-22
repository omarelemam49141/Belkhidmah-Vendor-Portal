'use client'

import { motion } from 'framer-motion'
import { fadeUp, motionTransition } from '@/lib/motion/presets'
import { useReducedMotion } from '@/hooks/use-reduced-motion'
import { cn } from '@/lib/utils'

export function FadeIn ({
  className,
  delay = 0,
  children
}: {
  className?: string
  delay?: number
  children: React.ReactNode
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>
  return (
    <motion.div
      className={cn('transform-gpu', className)}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
      transition={{ ...motionTransition, delay }}
    >
      {children}
    </motion.div>
  )
}
