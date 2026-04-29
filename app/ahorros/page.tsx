'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FadeIn, PageTransition } from '@/components/Animations'
import { PiggyBank, Target, Plus, ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useGoalStore } from '@/stores/goals'
import { GoalForm, AddSavingsForm } from '@/components/GoalForm'
import { AnimatePresence } from 'framer-motion'

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
      <main className="max-w-md mx-auto p-4 space-y-5">
        <FadeIn>
          <div className="flex items-center gap-3">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-glass transition-all"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600 dark:text-slate-300" strokeWidth={1.5} />
              </motion.div>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                <PiggyBank className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
              </div>
              <div>
                <h1 className="text-xl font-bold">Mis Ahorros</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sigue tu progreso</p>
              </div>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-emerald-500/90 via-emerald-600/90 to-teal-600/90 backdrop-blur-xl border border-white/20 shadow-glass p-6">
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-4 -bottom-12 h-32 w-32 rounded-full bg-white/5 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/10">
                    <span className="text-base">🏺</span>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Total Ahorrado</span>
                </div>
                <span className="text-xs font-bold text-emerald-200">{porcentaje.toFixed(1)}%</span>
              </div>

              <p className="text-3xl font-bold text-white mb-1">
                {formatoPesos.format(totalActual)}
              </p>

              <div className="flex items-center gap-1 mb-4">
                <Target className="h-3 w-3 text-emerald-200" strokeWidth={2} />
                <span className="text-xs text-emerald-200">
                  Meta total: {formatoPesos.format(totalMeta)}
                </span>
              </div>

              {totalMeta > 0 && (
                <div className="h-3 w-full rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${porcentaje}%` }}
                    transition={{ duration: 1.2, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-white/40 to-white/60"
                  />
                </div>
              )}
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <button
            onClick={() => setShowGoalForm(true)}
            className="w-full"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-white/10 py-4 shadow-glass transition-all hover:bg-white/80 dark:hover:bg-slate-800/80"
            >
              <Plus className="h-5 w-5 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Nueva meta de ahorro</span>
            </motion.div>
          </button>
        </FadeIn>

        {goals.length > 0 && (
          <>
            <FadeIn delay={0.15}>
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Metas en progreso</h2>
                {goals.length > 2 && (
                  <button
                    onClick={() => setShowAllGoals(!showAllGoals)}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-medium"
                  >
                    {showAllGoals ? 'Ver menos' : `Ver todas (${goals.length})`}
                  </button>
                )}
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="space-y-3">
                {(showAllGoals ? activeGoals : activeGoals.slice(0, 2)).map((goal, i) => {
                  const pct = Math.min((goal.current_amount / goal.target_amount) * 100, 100)
                  return (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="relative overflow-hidden rounded-2xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-white/10 p-4 shadow-glass"
                    >
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-full" />

                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{goal.emoji}</span>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{goal.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {formatoPesos.format(goal.current_amount)} / {formatoPesos.format(goal.target_amount)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{pct.toFixed(0)}%</span>
                          <button
                            onClick={() => setAddingToGoal(goal.id)}
                            className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="h-2 w-full rounded-full bg-slate-200/50 dark:bg-slate-700/50 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
                        />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </FadeIn>

            {completedGoals.length > 0 && (
              <FadeIn delay={0.25}>
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completadas</h2>
                <div className="space-y-3">
                  {completedGoals.map((goal, i) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      className="relative overflow-hidden rounded-2xl bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{goal.emoji}</span>
                          <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">{goal.name}</p>
                            <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">✓ Completada</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar esta meta?')) remove(goal.id)
                          }}
                          className="flex h-8 w-8 items-center justify-center rounded-xl bg-red-100 dark:bg-red-900/30 text-red-500 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            )}
          </>
        )}

        {goals.length === 0 && !showGoalForm && (
          <FadeIn delay={0.15}>
            <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 py-12 text-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700 mb-4"
              >
                <PiggyBank className="h-8 w-8 text-slate-400" />
              </motion.div>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Sin metas de ahorro</p>
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
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-bold">Nueva meta de ahorro</h3>
                  <button
                    onClick={() => setShowGoalForm(false)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700"
                  >
                    ✕
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