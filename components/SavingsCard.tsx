'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PiggyBank, TrendingUp } from 'lucide-react'

interface SavingsCardProps {
  montoActual: number
  metaTotal: number
}

const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function SavingsCard({ montoActual, metaTotal }: SavingsCardProps) {
  const porcentaje = Math.min((montoActual / metaTotal) * 100, 100)
  const nivelLiq = Math.min(porcentaje, 100)

  const bgLevel = nivelLiq > 0 ? 'bg-gradient-to-t from-emerald-400/30 to-emerald-300/10' : ''

  return (
    <Link
      href="/ahorros"
      className="block cursor-pointer group"
      role="button"
      aria-label="Ver mis ahorros"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative overflow-hidden rounded-3xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/20 dark:border-white/10 p-5 shadow-glass transition-all duration-300 group-hover:bg-white/60 dark:group-hover:bg-slate-800/60"
      >
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-emerald-400/10 blur-xl" />
        <div className="absolute -left-2 -bottom-6 h-16 w-16 rounded-full bg-sky-400/10 blur-lg" />

        <div className="relative flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mis Ahorros</span>
            </div>

            <p className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatoPesos.format(montoActual)}
            </p>

            <div className="flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" strokeWidth={2} />
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {porcentaje.toFixed(1)}% de {formatoPesos.format(metaTotal)}
              </span>
            </div>

            <div className="mt-3 h-2 w-full rounded-full bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${porcentaje}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm"
              />
            </div>
          </div>

          <div className="relative ml-4 flex-shrink-0">
            <div className={`relative ${bgLevel} rounded-2xl p-3 transition-all duration-300`}>
              <svg width="48" height="56" viewBox="0 0 48 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 20C8 16 12 12 24 12C36 12 40 16 40 20V44C40 48 36 52 24 52C12 52 8 48 8 44V20Z" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="2"/>
                <path d="M4 20C4 14 10 8 24 8C38 8 44 14 44 20" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
                <rect x="18" y="4" width="12" height="6" rx="2" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5"/>

                {nivelLiq > 0 && (
                  <motion.rect
                    initial={{ y: 44, height: 0 }}
                    animate={{ y: 44 - (nivelLiq * 0.32), height: nivelLiq * 0.32 }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    x="10"
                    width="28"
                    rx="4"
                    fill="url(#liquidGradient)"
                  />
                )}

                <defs>
                  <linearGradient id="liquidGradient" x1="24" y1="0" x2="24" y2="1" gradientUnits="ratio">
                    <stop offset="0%" stopColor="#34D399" stopOpacity="0.6"/>
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.8"/>
                  </linearGradient>
                </defs>
              </svg>

              {nivelLiq >= 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white"
                >
                  ✓
                </motion.div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
          <span className="font-medium">Toca para ver detalles</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
        </div>
      </motion.div>
    </Link>
  )
}