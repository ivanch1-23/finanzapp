'use client'

import { useEffect } from 'react'
import { useTransactionStore } from '@/stores/transactions'
import { getWeekOfMonth, isSameMonth } from '@/lib/utils'
import { formatCOP } from './Animations'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, ArrowUpRight, ArrowDownRight, Repeat, Trash2, CreditCard } from 'lucide-react'
import { StaggerContainer, StaggerItem } from './Animations'

interface Props {
  limit?: number
  selectedMonth?: Date
}

export function TransactionList({ limit, selectedMonth }: Props = {}) {
  const transactions = useTransactionStore((s) => s.transactions)
  const load = useTransactionStore((s) => s.load)
  const remove = useTransactionStore((s) => s.remove)
  const loading = useTransactionStore((s) => s.loading)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filteredTransactions = selectedMonth
    ? transactions.filter(tx => isSameMonth(tx.transaction_date, selectedMonth))
    : transactions

  const displayTransactions = limit ? filteredTransactions.slice(0, limit) : filteredTransactions

  const grouped = displayTransactions.reduce<Record<number, typeof displayTransactions>>((acc, tx) => {
    const week = getWeekOfMonth(tx.transaction_date)
    if (!acc[week]) acc[week] = []
    acc[week].push(tx)
    return acc
  }, {})

  const weeks = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => a - b)

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-14 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    )
  }

  if (filteredTransactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-8 text-center"
      >
        <CreditCard className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sin movimientos en este mes</p>
      </motion.div>
    )
  }

  return (
    <StaggerContainer className="space-y-4">
      {weeks.map((week) => {
        const txs = grouped[week]
        const income = txs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0)
        const expense = txs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0)

        return (
          <StaggerItem key={week}>
            <div className="border border-slate-100 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/50 p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-slate-200 dark:bg-slate-700 text-[10px] font-semibold text-slate-600 dark:text-slate-300">W{week}</span>
                  <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400">Semana {week}</h3>
                </div>
                <div className="flex gap-3 text-[11px] font-medium">
                  {income > 0 && (
                    <span className="flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400">
                      <ArrowUpRight className="h-3 w-3" />{formatCOP(income)}
                    </span>
                  )}
                  {expense > 0 && (
                    <span className="flex items-center gap-0.5 text-slate-600 dark:text-slate-300">
                      <ArrowDownRight className="h-3 w-3" />{formatCOP(expense)}
                    </span>
                  )}
                </div>
              </div>

              <AnimatePresence mode="popLayout">
                {txs.map((tx, i) => (
                  <motion.div
                    key={tx.id}
                    layout={true}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10, height: 0 }}
                    transition={{ duration: 0.2, delay: i * 0.03 }}
                    className="group relative flex items-center gap-3 rounded-lg bg-white dark:bg-slate-800 p-3 mb-2 last:mb-0 border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-semibold ${
                      tx.type === 'income'
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                    }`}>
                      {tx.title.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-900 dark:text-white">{tx.title}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{tx.category}</span>
                        <span className="text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400">{tx.transaction_date}</span>
                        {tx.is_recurring && (
                          <span className="flex items-center gap-0.5 rounded bg-amber-100 dark:bg-amber-900/20 px-1.5 py-0.5">
                            <Repeat className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-sm font-medium ${
                        tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCOP(tx.amount)}
                      </p>
                    </div>

                    <motion.button
                      initial={{ opacity: 0 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => remove(tx.id)}
                      className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500"
                    >
                      <Trash2 className="h-3 w-3" />
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </StaggerItem>
        )
      })}
    </StaggerContainer>
  )
}
