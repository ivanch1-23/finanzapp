'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion'
import { usePathname } from 'next/navigation'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function FadeIn({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerContainer({
  children,
  className = '',
  staggerDelay = 0.06
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className = ''
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({
  children,
  direction = 'right',
  delay = 0,
  className = ''
}: {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  className?: string
}) {
  const directions = {
    left: { x: -24, y: 0 },
    right: { x: 24, y: 0 },
    up: { x: 0, y: 24 },
    down: { x: 0, y: -24 }
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// CountUp Animation
export function CountUp({
  value,
  duration = 1.5,
  format = (n: number) => n.toString(),
  className = ''
}: {
  value: number
  duration?: number
  format?: (n: number) => string
  className?: string
}) {
  const [display, setDisplay] = useState(0)

  const spring = useSpring(0, {
    stiffness: 80,
    damping: 20
  })

  useEffect(() => {
    spring.set(value)
  }, [spring, value])

  useEffect(() => {
    const unsubscribe = spring.on('change', (latest) => {
      setDisplay(Math.round(latest))
    })
    return unsubscribe
  }, [spring])

  return (
    <motion.span
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {format(display)}
    </motion.span>
  )
}

export function formatCOP(amount: number) {
  return '$' + amount.toLocaleString('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).replace(/,/g, '')
}

export function Skeleton({
  className = '',
  lines = 1
}: {
  className?: string
  lines?: number
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          className="h-14 rounded-2xl bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-shimmer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}
    </div>
  )
}

export function PulseDot({
  color = 'bg-primary',
  size = 'h-2 w-2'
}: {
  color?: string
  size?: string
}) {
  return (
    <motion.span
      className={`${color} ${size} rounded-full inline-block`}
      animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
    />
  )
}
