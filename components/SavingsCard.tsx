'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { PiggyBank, Plus, Target } from 'lucide-react'
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
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-colors group-hover:border-slate-300 dark:group-hover:border-slate-600"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
            <PiggyBank className="h-4 w-4 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mis Ahorros</span>
          </div>
        </div>

        <p className="text-2xl font-semibold text-slate-900 dark:text-white">
          {formatoPesos.format(totalActual)}
        </p>

        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {goals.length} {goals.length === 1 ? 'meta' : 'metas'}
          </span>
          {totalMeta > 0 && (
            <span className="text-xs text-slate-400 dark:text-slate-500">
              · {porcentaje.toFixed(0)}% de {formatoPesos.format(totalMeta)}
            </span>
          )}
        </div>

        {totalMeta > 0 && (
          <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${porcentaje}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full rounded-full bg-slate-700 dark:bg-slate-300"
            />
          </div>
        )}

        {goals.length === 0 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Plus className="h-3 w-3" />
            <span>Agrega tu primera meta</span>
          </div>
        )}

        <div className="mt-3 flex items-center gap-2">
          <Target className="h-3 w-3 text-slate-400" />
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {totalMeta > 0 ? `Faltan ${formatoPesos.format(totalMeta - totalActual)}` : 'Sin metas definidas'}
          </span>
        </div>
      </motion.div>
    </Link>
  )
}
