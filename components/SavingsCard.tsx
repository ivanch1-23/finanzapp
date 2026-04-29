'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PiggyBank, Plus } from 'lucide-react'
import { useGoalStore } from '@/stores/goals'
import { useEffect } from 'react'

const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function SavingsCard() {
  const goals = useGoalStore((s) => s.goals)
  const load = useGoalStore((s) => s.load)

  useEffect(() => {
    load()
  }, [load])

  const totalActual = goals.reduce((sum, g) => sum + g.current_amount, 0)
  const totalMeta = goals.reduce((sum, g) => sum + g.target_amount, 0)
  const porcentaje = totalMeta > 0 ? Math.min((totalActual / totalMeta) * 100, 100) : 0

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

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
              <PiggyBank className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mis Ahorros</span>
          </div>

          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatoPesos.format(totalActual)}
          </p>

          <div className="flex items-center gap-1 mt-1">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              {goals.length} {goals.length === 1 ? 'meta' : 'metas'}
            </span>
            {totalMeta > 0 && (
              <span className="text-xs text-slate-500 dark:text-slate-400">
                · {porcentaje.toFixed(0)}% de {formatoPesos.format(totalMeta)}
              </span>
            )}
          </div>

          {totalMeta > 0 && (
            <div className="mt-3 h-2 w-full rounded-full bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${porcentaje}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-sm"
              />
            </div>
          )}

          {goals.length === 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <Plus className="h-3 w-3" />
              <span>Agrega tu primera meta</span>
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-1.5">
            {goals.slice(0, 3).map((goal) => (
              <span
                key={goal.id}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-[10px] font-medium"
              >
                {goal.emoji} {((goal.current_amount / goal.target_amount) * 100).toFixed(0)}%
              </span>
            ))}
            {goals.length > 3 && (
              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-slate-700 px-2 py-1 text-[10px] font-medium">
                +{goals.length - 3}
              </span>
            )}
          </div>
        </div>
      </motion.div>
    </Link>
  )
}