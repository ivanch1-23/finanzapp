'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FadeIn, PageTransition } from '@/components/Animations'
import { PiggyBank, Target, Plus, ArrowLeft, Trash2, X, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useGoalStore } from '@/stores/goals'
import { GoalForm, AddSavingsForm } from '@/components/GoalForm'
import { AnimatePresence } from 'framer-motion'
import { JarWithLabel } from '@/components/JarProgress'

const formatoPesos = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export default function SavingsPage() {
  const goals = useGoalStore((s) => s.goals)
  const load = useGoalStore((s) => s.load)
  const remove = useGoalStore((s) => s.remove)

  const [showGoalForm, setShowGoalForm] = useState(false)
  const [addingToGoal, setAddingToGoal] = useState<string | null>(null)
  const [showAllGoals, setShowAllGoals] = useState(false)

  useEffect(() => {
    load()
  }, [load])

  const totalActual = goals.reduce((sum, g) => sum + g.current_amount, 0)
  const totalMeta = goals.reduce((sum, g) => sum + g.target_amount, 0)
  const porcentaje = totalMeta > 0 ? Math.min((totalActual / totalMeta) * 100, 100) : 0

  const completedGoals = goals.filter(g => g.current_amount >= g.target_amount)
  const activeGoals = goals.filter(g => g.current_amount < g.target_amount)

  const handleGoalSuccess = () => {
    setShowGoalForm(false)
  }

  return (
    <PageTransition>
      <main className="max-w-lg mx-auto px-4 pt-6 pb-24 space-y-6">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              </motion.div>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700">
                <PiggyBank className="h-5 w-5 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Mis Ahorros</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sigue tu progreso</p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Ahorrado</span>
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">{porcentaje.toFixed(1)}%</span>
            </div>

            <p className="text-3xl font-semibold text-slate-900 dark:text-white mb-2">
              {formatoPesos.format(totalActual)}
            </p>

            <div className="flex items-center gap-1 mb-4">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Meta total: {formatoPesos.format(totalMeta)}
              </span>
            </div>

            {totalMeta > 0 && (
              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${porcentaje}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full rounded-full bg-slate-700 dark:bg-slate-300"
                />
              </div>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setShowGoalForm(true)}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white py-3 text-sm font-medium text-white dark:text-slate-900 transition-colors hover:bg-slate-800 dark:hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            Nueva meta de ahorro
          </motion.button>
        </FadeIn>

        {goals.length > 0 && (
          <>
            <FadeIn delay={0.15}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Metas en progreso</h2>
                {goals.length > 2 && (
                  <button
                    onClick={() => setShowAllGoals(!showAllGoals)}
                    className="text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    {showAllGoals ? 'Ver menos' : `Ver todas (${goals.length})`}
                  </button>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-3">
                {(showAllGoals ? activeGoals : activeGoals.slice(0, 2)).map((goal, i) => {
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <JarWithLabel
                            currentAmount={goal.current_amount}
                            targetAmount={goal.target_amount}
                            emoji={goal.emoji}
                          />
                        </div>
                        <div className="flex items-center gap-2 ml-3">
                          <button
                            onClick={() => setAddingToGoal(goal.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm('¿Eliminar esta meta?')) remove(goal.id)
                            }}
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </FadeIn>

            {completedGoals.length > 0 && (
              <FadeIn delay={0.25}>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Completadas</h2>
                <div className="space-y-2">
                  {completedGoals.map((goal) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4"
                    >
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-white">{goal.name}</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-400">{formatoPesos.format(goal.target_amount)}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar esta meta?')) remove(goal.id)
                        }}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            )}
          </>
        )}

        {goals.length === 0 && !showGoalForm && (
          <FadeIn delay={0.15}>
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-12 text-center">
              <PiggyBank className="h-10 w-10 text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Sin metas de ahorro</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Crea tu primera meta para empezar</p>
            </div>
          </FadeIn>
        )}

        <div className="h-4" />

        <AnimatePresence>
          {showGoalForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onClick={() => setShowGoalForm(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Nueva meta de ahorro</h3>
                  <button
                    onClick={() => setShowGoalForm(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <GoalForm onSuccess={handleGoalSuccess} onCancel={() => setShowGoalForm(false)} />
              </motion.div>
            </motion.div>
          )}

          {addingToGoal && (
            <AddSavingsForm
              goalId={addingToGoal}
              goalName={goals.find(g => g.id === addingToGoal)?.name || ''}
              onClose={() => setAddingToGoal(null)}
            />
          )}
        </AnimatePresence>
      </main>
    </PageTransition>
  )
}
