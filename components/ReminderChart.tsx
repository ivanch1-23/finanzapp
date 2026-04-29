'use client'

import { motion } from 'framer-motion'
import { useReminderStore } from '@/stores/reminders'
import { useEffect } from 'react'
import { formatCOP } from './Animations'
import { isSameMonth } from '@/lib/utils'
import { useState } from 'react'

interface ReminderChartProps {
  selectedMonth: Date
}

export function ReminderChart({ selectedMonth }: ReminderChartProps) {
  const reminders = useReminderStore((s) => s.reminders)
  const load = useReminderStore((s) => s.load)
  const [showLabels, setShowLabels] = useState(false)

  useEffect(() => {
    load()
  }, [load])

  const monthlyReminders = reminders.filter(r => isSameMonth(r.due_date, selectedMonth))
  const unpaidReminders = monthlyReminders.filter(r => !r.is_paid)

  const sortedByAmount = [...unpaidReminders].sort((a, b) => (b.amount || 0) - (a.amount || 0))
  const maxAmount = sortedByAmount.length > 0 ? Math.max(...sortedByAmount.map(r => r.amount || 0)) : 0

  if (unpaidReminders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 py-8 text-center">
        <span className="text-3xl mb-2">📊</span>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sin pagos pendientes este mes</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Próximos pagos ({unpaidReminders.length})
        </h3>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="text-xs text-sky-500 font-medium"
        >
          {showLabels ? 'Ocultar' : 'Mostrar'} valores
        </button>
      </div>

      <div className="flex items-end gap-2 h-40 pb-2">
        {sortedByAmount.map((reminder, index) => {
          const heightPercent = maxAmount > 0 ? ((reminder.amount || 0) / maxAmount) * 100 : 0
          const isUrgent = !reminder.is_paid && new Date(reminder.due_date) <= new Date(Date.now() + 24 * 60 * 60 * 1000)

          return (
            <div key={reminder.id} className="flex-1 flex flex-col items-center gap-1">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(heightPercent, 8)}%` }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className={`w-full rounded-t-lg relative group cursor-pointer ${
                  isUrgent
                    ? 'bg-gradient-to-t from-rose-400 to-rose-300'
                    : 'bg-gradient-to-t from-sky-400 to-cyan-300'
                }`}
              >
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-slate-900 dark:bg-slate-700 text-white text-[10px] px-2 py-1 rounded-lg whitespace-nowrap">
                    {formatCOP(reminder.amount || 0)}
                  </div>
                </div>
              </motion.div>

              <div className="text-center">
                <span className="text-sm">{reminder.title.charAt(0)}</span>
                {showLabels && reminder.amount && (
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 mt-1">
                    {formatCOP(reminder.amount)}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-sky-400 to-cyan-300" />
          <span className="text-slate-500 dark:text-slate-400">Normal</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gradient-to-t from-rose-400 to-rose-300" />
          <span className="text-slate-500 dark:text-slate-400">Urgente (24h)</span>
        </div>
      </div>
    </div>
  )
}