'use client'

import { useEffect } from 'react'
import { useTransactionStore } from '@/stores/transactions'
import { getWeekOfMonth, isSameMonth } from '@/lib/utils'
import { formatCOP } from './Animations'
import { motion, AnimatePresence } from 'framer-motion'
import { Receipt, ArrowUpRight, ArrowDownRight, Repeat, Trash2 } from 'lucide-react'
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
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-16 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse"
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-12 text-center"
      >
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-700"
        >
          <Receipt className="h-8 w-8 text-slate-400" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300"
        >
          Sin movimientos en este mes
        </motion.p>
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
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/80 p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-xl bg-sky-100 dark:bg-sky-900/30">
                    <span className="text-[10px] font-bold text-sky-600 dark:text-sky-400">W{week}</span>
                  </div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Semana {week}
                  </h3>
                </div>
                <div className="flex gap-3 text-[11px] font-bold">
                  {income > 0 && (
                    <span className="flex items-center gap-0.5 text-teal-600 dark:text-teal-400">
                      <ArrowUpRight className="h-3 w-3" />{formatCOP(income)}
                    </span>
                  )}
                  {expense > 0 && (
                    <span className="flex items-center gap-0.5 text-sky-600 dark:text-sky-400">
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
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className="group relative flex items-center gap-3 rounded-xl bg-slate-50 dark:bg-slate-700/30 p-3 mb-2 last:mb-0 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                  >
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg font-bold ${
                        tx.type === 'income'
                          ? 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400'
                          : 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400'
                      }`}
                    >
                      {tx.title.charAt(0)}
                    </motion.div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-900 dark:text-white">{tx.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{tx.category}</span>
                        <span className="text-[10px] text-slate-300 dark:text-slate-600">·</span>
                        <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{tx.transaction_date}</span>
                        {tx.is_recurring && (
                          <span className="flex items-center gap-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 px-1.5 py-0.5">
                            <Repeat className="h-2.5 w-2.5 text-amber-600 dark:text-amber-400" />
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <p className={`text-sm font-bold ${
                        tx.type === 'income' ? 'text-teal-600 dark:text-teal-400' : 'text-sky-600 dark:text-sky-400'
                      }`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCOP(tx.amount)}
                      </p>
                    </div>

                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => remove(tx.id)}
                      className="absolute -right-1 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-600 text-slate-500 dark:text-slate-400 opacity-0 transition-opacity group-hover:opacity-100"
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
