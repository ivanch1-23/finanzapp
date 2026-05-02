'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { TransactionList } from '@/components/TransactionList'
import { ReminderList } from '@/components/ReminderList'
import { MonthSelector } from '@/components/MonthSelector'
import { useTransactionStore } from '@/stores/transactions'
import { useReminderStore } from '@/stores/reminders'
import { ThemeToggle } from '@/components/ThemeToggle'
import { TrendingUp, TrendingDown, ArrowRight, LogOut, Wallet, Plus, Bell } from 'lucide-react'
import { motion } from 'framer-motion'
import { PageTransition, FadeIn } from '@/components/Animations'
import { formatCOP } from '@/components/Animations'
import Link from 'next/link'
import { isSameMonth } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { SavingsCard } from '@/components/SavingsCard'

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
      <main className="max-w-lg mx-auto px-4 pt-6 pb-24 space-y-6">
        {/* Header */}
        <FadeIn className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/finanzapplogo.png"
                alt="FinanzApp"
                width={40}
                height={40}
                className="rounded-xl"
              />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900 dark:text-white">FinanzApp</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {user?.email?.split('@')[0] || 'Usuario'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={handleSignOut}
              className="flex items-center justify-center h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <LogOut className="h-4 w-4 text-slate-500 dark:text-slate-400" strokeWidth={1.5} />
            </button>
          </div>
        </FadeIn>

        {/* Month Selector */}
        <FadeIn delay={0.05}>
          <div className="flex items-center justify-center">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />
          </div>
        </FadeIn>

        {/* Balance Card */}
        <FadeIn delay={0.1}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Balance del mes</span>
            </div>

            <p className={`text-3xl font-semibold ${balance >= 0 ? 'text-slate-900 dark:text-white' : 'text-red-600 dark:text-red-400'}`}>
              {formatCOP(balance)}
            </p>

            <div className="mt-5 flex gap-4">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
                  <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">Ingresos</p>
                  <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{formatCOP(income)}</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
                className="flex items-center gap-3"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 dark:bg-red-900/20">
                  <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 uppercase">Gastos</p>
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">{formatCOP(expense)}</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </FadeIn>

        {/* Quick Actions */}
        <FadeIn delay={0.15}>
          <div className="flex gap-3">
            <Link href="/add" className="flex-1">
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center justify-center gap-2 rounded-xl bg-slate-900 dark:bg-white py-3 text-sm font-medium text-white dark:text-slate-900 transition-colors"
              >
                <Plus className="h-4 w-4" />
                Nueva transacción
              </motion.div>
            </Link>
            <Link href="/reminders" className="relative flex items-center justify-center gap-2 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 transition-colors hover:bg-slate-200 dark:hover:bg-slate-700">
              <Bell className="h-4 w-4 text-slate-600 dark:text-slate-300" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-200">Alarmas</span>
              {reminders.filter(r => !r.is_paid).length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 dark:bg-white text-[10px] font-bold text-white dark:text-slate-900"
                >
                  {reminders.filter(r => !r.is_paid).length}
                </motion.span>
              )}
            </Link>
          </div>
        </FadeIn>

        {/* Savings Card */}
        <FadeIn delay={0.17}>
          <SavingsCard />
        </FadeIn>

        {/* Reminders Section */}
        <FadeIn delay={0.22}>
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Próximos pagos</h2>
              <Link href="/reminders" className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Ver todo <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <ReminderList limit={3} />
          </div>
        </FadeIn>

        {/* Transactions Section */}
        <FadeIn delay={0.25}>
          <div className="border border-slate-200 dark:border-slate-700 rounded-2xl p-4 bg-white dark:bg-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Movimientos</h2>
              <Link href="/history" className="flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
                Ver todo <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {isLoading ? (
              <div className="space-y-3">
                <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
                <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
                <div className="h-14 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse" />
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
