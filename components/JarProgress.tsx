'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface JarProgressProps {
  currentAmount: number
  targetAmount: number
  size?: 'sm' | 'md' | 'lg'
}

export function JarProgress({ currentAmount, targetAmount, size = 'md' }: JarProgressProps) {
  const [fillPercent, setFillPercent] = useState(0)
  const percentage = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0

  useEffect(() => {
    const timer = setTimeout(() => {
      setFillPercent(percentage)
    }, 100)
    return () => clearTimeout(timer)
  }, [percentage])

  const dimensions = {
    sm: { width: 40, height: 56, jarWidth: 32, jarHeight: 40 },
    md: { width: 60, height: 84, jarWidth: 48, jarHeight: 60 },
    lg: { width: 80, height: 112, jarWidth: 64, jarHeight: 80 },
  }

  const { width, height, jarWidth, jarHeight } = dimensions[size]

  return (
    <div className="relative" style={{ width, height }}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <clipPath id={`jar-clip-${size}`}>
            <path
              d={`M ${width * 0.15} ${height * 0.15}
                 L ${width * 0.85} ${height * 0.15}
                 L ${width * 0.85} ${height * 0.85}
                 Q ${width * 0.85} ${height * 0.95} ${width * 0.65} ${height * 0.95}
                 Q ${width * 0.5} ${height} ${width * 0.35} ${height * 0.95}
                 Q ${width * 0.15} ${height * 0.95} ${width * 0.15} ${height * 0.85}
                 L ${width * 0.15} ${height * 0.15}
                 M ${width * 0.25} 0
                 L ${width * 0.75} 0
                 L ${width * 0.75} ${height * 0.15}
                 L ${width * 0.25} ${height * 0.15}
                 Z`}
            />
          </clipPath>
          <linearGradient id={`jar-fill-${size}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#A3E635" />
          </linearGradient>
        </defs>

        <path
          d={`M ${width * 0.15} ${height * 0.15}
             L ${width * 0.85} ${height * 0.15}
             L ${width * 0.85} ${height * 0.85}
             Q ${width * 0.85} ${height * 0.95} ${width * 0.65} ${height * 0.95}
             Q ${width * 0.5} ${height} ${width * 0.35} ${height * 0.95}
             Q ${width * 0.15} ${height * 0.95} ${width * 0.15} ${height * 0.85}
             Z`}
          fill="rgba(148, 163, 184, 0.2)"
          stroke="rgba(148, 163, 184, 0.5)"
          strokeWidth="1.5"
        />

        <path
          d={`M ${width * 0.25} 0
             L ${width * 0.75} 0
             L ${width * 0.75} ${height * 0.15}
             L ${width * 0.25} ${height * 0.15}
             Z`}
          fill="rgba(148, 163, 184, 0.3)"
          stroke="rgba(148, 163, 184, 0.5)"
          strokeWidth="1.5"
        />

        <motion.rect
          x={width * 0.15}
          y={height * 0.95}
          width={jarWidth}
          height={-jarHeight * (fillPercent / 100)}
          fill={`url(#jar-fill-${size})`}
          clipPath={`url(#jar-clip-${size})`}
          initial={{ height: 0 }}
          animate={{
            height: jarHeight * (fillPercent / 100),
            y: height * 0.95 - jarHeight * (fillPercent / 100)
          }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />

        <circle cx={width * 0.3} cy={height * 0.5} r={2} fill="rgba(255,255,255,0.6)" />
        <circle cx={width * 0.5} cy={height * 0.6} r={1.5} fill="rgba(255,255,255,0.4)" />
        <circle cx={width * 0.65} cy={height * 0.45} r={1} fill="rgba(255,255,255,0.3)" />
      </svg>

      {size !== 'sm' && (
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
          {fillPercent.toFixed(0)}%
        </div>
      )}
    </div>
  )
}

interface JarDisplayProps {
  currentAmount: number
  targetAmount: number
  emoji: string
}

export function JarWithLabel({ currentAmount, targetAmount, emoji }: JarDisplayProps) {
  const percentage = targetAmount > 0 ? Math.min((currentAmount / targetAmount) * 100, 100) : 0

  const formatoPesos = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })

  return (
    <div className="flex items-center gap-3">
      <JarProgress currentAmount={currentAmount} targetAmount={targetAmount} size="md" />
      <div className="flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-lg">{emoji}</span>
          <span className="text-sm font-bold text-slate-900 dark:text-white">
            {formatoPesos.format(currentAmount)}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
          />
        </div>
        <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
          {formatoPesos.format(currentAmount)} / {formatoPesos.format(targetAmount)}
        </p>
      </div>
    </div>
  )
}