'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { TransactionList } from '@/components/TransactionList'
import { ReminderList } from '@/components/ReminderList'
import { MonthSelector } from '@/components/MonthSelector'
import { useTransactionStore } from '@/stores/transactions'
import { useReminderStore } from '@/stores/reminders'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TrendingUp, TrendingDown, ArrowRight, LogOut } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageTransition, FadeIn } from '@/components/Animations'
import { formatCOP } from '@/components/Animations'
import Link from 'next/link'
import { isSameMonth } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date())
  const { user, signOut } = useAuth()

  const transactions = useTransactionStore((s) => s.transactions)
  const loadTransactions = useTransactionStore((s) => s.load)
  const loadingTx = useTransactionStore((s) => s.loading)
  const reminders = useReminderStore((s) => s.reminders)
  const loadReminders = useReminderStore((s) => s.load)

  useEffect(() => {
    loadTransactions()
    loadReminders()
  }, [loadTransactions, loadReminders])

  const monthlyTransactions = useMemo(() => {
    return transactions.filter(tx => isSameMonth(tx.transaction_date, selectedMonth))
  }, [transactions, selectedMonth])

  const income = monthlyTransactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const expense = monthlyTransactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance = income - expense

  const isLoading = loadingTx && transactions.length === 0

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <PageTransition>
      <main className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <FadeIn className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/finanzapplogo.png"
                alt="FinanzApp"
                width={44}
                height={44}
                className="rounded-2xl shadow-glass"
              />
              <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">FinanzApp</h1>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                {user?.email?.split('@')[0] || 'Usuario'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center h-9 w-9 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-glass hover:bg-white/80 dark:hover:bg-slate-800/80 transition-colors"
            >
              <LogOut className="h-4 w-4 text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
            </button>
          </div>
        </FadeIn>

        {/* Month Selector */}
        <FadeIn delay={0.05}>
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-white/10 rounded-[1.5rem] p-1.5 shadow-glass">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>
        </FadeIn>

        {/* Balance Card - Glassmorphism */}
        <FadeIn delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-500/90 via-sky-600/90 to-cyan-600/90 backdrop-blur-xl border border-white/20 shadow-glass"
          >
            <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-4 -bottom-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute right-10 top-6 h-16 w-16 rounded-full bg-white/5 blur-xl" />

            <div className="relative p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm border border-white/10">
                  <span className="text-base">💰</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Balance del mes</span>
              </div>

              <p className="text-4xl font-semibold tracking-tight text-white drop-shadow-sm">
                {formatCOP(balance)}
              </p>

              <div className="mt-5 flex gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10 px-4 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/30 backdrop-blur-sm">
                    <TrendingUp className="h-4 w-4 text-emerald-200" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase text-white/70">Ingresos</p>
                    <p className="text-sm font-semibold text-white">{formatCOP(income)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center gap-2.5 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/10 px-4 py-3"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-400/30 backdrop-blur-sm">
                    <TrendingDown className="h-4 w-4 text-red-200" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase text-white/70">Gastos</p>
                    <p className="text-sm font-semibold text-white">{formatCOP(expense)}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </FadeIn>

        {/* Quick Actions - Glass Buttons */}
        <FadeIn delay={0.15}>
          <div className="flex gap-3">
            <Link href="/add" className="flex-1">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3.5 text-sm font-semibold text-white shadow-glass transition-all hover:shadow-lg"
              >
                <span className="relative z-10">+ Nueva transacción</span>
                <div className="absolute -right-2 -top-2 h-16 w-16 rounded-full bg-white/10 blur-xl" />
              </motion.div>
            </Link>
            <Link href="/reminders" className="relative overflow-hidden flex items-center justify-center gap-2 rounded-2xl bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-white/10 px-4 py-3.5 shadow-glass transition-all hover:shadow-glass hover:bg-white/80 dark:hover:bg-slate-800/80">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Alarmas</span>
              {reminders.filter(r => !r.is_paid).length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 text-[10px] font-bold text-white shadow-sm"
                >
                  {reminders.filter(r => !r.is_paid).length}
                </motion.span>
              )}
            </Link>
          </div>
        </FadeIn>

        {/* PROXIMOS PAGOS - Glass Panel */}
        <FadeIn delay={0.2}>
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-white/10 rounded-[2rem] p-4 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Próximos pagos</h2>
              <Link href="/reminders" className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
                Ver todo <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            </div>
            <ReminderList limit={5} />
          </div>
        </FadeIn>

        {/* MOVIMIENTOS - Glass Panel */}
        <FadeIn delay={0.25}>
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border border-white/20 dark:border-white/10 rounded-[2rem] p-4 shadow-glass">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Movimientos</h2>
              <Link href="/history" className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
                Ver todo <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
              </Link>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-16 rounded-2xl bg-white/40 dark:bg-slate-700/40 animate-pulse" />
                <div className="h-16 rounded-2xl bg-white/40 dark:bg-slate-700/40 animate-pulse" />
                <div className="h-16 rounded-2xl bg-white/40 dark:bg-slate-700/40 animate-pulse" />
              </div>
            ) : (
              <TransactionList limit={5} selectedMonth={selectedMonth} />
            )}
          </div>
        </FadeIn>

        <div className="h-4" />
      </main>
    </PageTransition>
  )
}