'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { TransactionList } from '@/components/TransactionList'
import { ReminderList } from '@/components/ReminderList'
import { MonthSelector } from '@/components/MonthSelector'
import { useTransactionStore } from '@/stores/transactions'
import { useReminderStore } from '@/stores/reminders'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageTransition, FadeIn } from '@/components/Animations'
import { formatCOP } from '@/components/Animations'
import Link from 'next/link'
import { isSameMonth } from '@/lib/utils'

export default function Home() {
  const [selectedMonth, setSelectedMonth] = useState(() => new Date())

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

  return (
    <PageTransition>
      <main className="max-w-md mx-auto p-4 space-y-5">
        {/* Header */}
        <FadeIn className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/finanzapplogo.png"
              alt="FinanzApp"
              width={40}
              height={40}
              className="rounded-xl"
            />
            <div>
              <h1 className="text-lg font-black tracking-tight">FinanzApp</h1>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">Tu dinero seguro</p>
            </div>
          </div>
          <ThemeToggle />
        </FadeIn>

        {/* Month Selector */}
        <FadeIn delay={0.05}>
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </FadeIn>

        {/* Balance Card - Light Blue gradient */}
        <FadeIn delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-400 via-sky-500 to-cyan-500 p-5 text-white shadow-xl"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -left-6 -bottom-12 h-32 w-32 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute right-8 top-8 h-24 w-24 rounded-full bg-white/5 blur-2xl" />

            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <span className="text-sm">💰</span>
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-white/80">Balance del mes</span>
              </div>

              <p className="text-4xl font-black tracking-tight">
                {formatCOP(balance)}
              </p>

              <div className="mt-5 flex gap-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-2.5"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                    <TrendingUp className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase text-white/70">Ingresos</p>
                    <p className="text-sm font-bold">{formatCOP(income)}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 }}
                  className="flex items-center gap-2 rounded-2xl bg-white/15 backdrop-blur-sm px-4 py-2.5"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/20">
                    <TrendingDown className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-medium uppercase text-white/70">Gastos</p>
                    <p className="text-sm font-bold">{formatCOP(expense)}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </FadeIn>

        {/* Quick Actions - Pastel Green button */}
        <FadeIn delay={0.15}>
          <div className="flex gap-3">
            <Link href="/add" className="flex-1">
              <motion.div
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-teal-400 to-emerald-400 py-3.5 text-sm font-bold text-white shadow-lg transition-shadow hover:shadow-xl"
              >
                <span>+ Nueva transacción</span>
              </motion.div>
            </Link>
            <Link href="/reminders" className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-3.5 shadow-sm transition-shadow hover:shadow-md">
              <span className="text-sm font-semibold">Alarmas</span>
              {reminders.filter(r => !r.is_paid).length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-[10px] font-bold text-white"
                >
                  {reminders.filter(r => !r.is_paid).length}
                </motion.span>
              )}
            </Link>
          </div>
        </FadeIn>

        {/* Transactions */}
        <FadeIn delay={0.2}>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Movimientos</h2>
            <Link href="/history" className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Ver todo <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
              <div className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse" />
            </div>
          ) : (
            <TransactionList limit={10} selectedMonth={selectedMonth} />
          )}
        </FadeIn>

        {/* Reminders */}
        <FadeIn delay={0.25}>
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Próximos pagos</h2>
            <Link href="/reminders" className="flex items-center gap-1 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
              Ver todo <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <ReminderList limit={3} />
        </FadeIn>

        <div className="h-4" />
      </main>
    </PageTransition>
  )
}
