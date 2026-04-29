'use client'

import { motion } from 'framer-motion'
import { useReminderStore } from '@/stores/reminders'
import { useEffect } from 'react'
import { isSameMonth } from '@/lib/utils'
import { useState } from 'react'

function extractEmoji(text: string): string {
  const firstChar = text.charAt(0)
  const code = firstChar.codePointAt(0)
  if (code && (
    (code >= 0x1F300 && code <= 0x1F9FF) ||
    (code >= 0x2600 && code <= 0x26FF) ||
    (code >= 0x2700 && code <= 0x27BF) ||
    (code >= 0x1F600 && code <= 0x1F64F) ||
    (code >= 0x1F680 && code <= 0x1F6FF) ||
    (code >= 0x1F1E0 && code <= 0x1F1FF)
  )) {
    return firstChar
  }
  return '📌'
}

function stripEmoji(text: string): string {
  const result: string[] = []
  for (const char of text) {
    const code = char.codePointAt(0)
    if (code && !(
      (code >= 0x1F300 && code <= 0x1F9FF) ||
      (code >= 0x2600 && code <= 0x26FF) ||
      (code >= 0x2700 && code <= 0x27BF) ||
      (code >= 0x1F600 && code <= 0x1F64F) ||
      (code >= 0x1F680 && code <= 0x1F6FF) ||
      (code >= 0x1F1E0 && code <= 0x1F1FF)
    )) {
      result.push(char)
    }
  }
  return result.join('').trim()
}

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
      <div className="flex flex-col items-center justify-center rounded-2xl bg-slate-50 dark:bg-slate-800/50 py-6 text-center">
        <span className="text-3xl mb-2">📊</span>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sin pagos pendientes este mes</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Resumen de pagos ({unpaidReminders.length})
        </h3>
        <button
          onClick={() => setShowLabels(!showLabels)}
          className="text-xs text-sky-500 font-medium"
        >
          {showLabels ? 'Ocultar' : 'Ver montos'}
        </button>
      </div>

      <div className="flex items-end justify-start gap-2 h-44 overflow-x-auto pb-2">
        {sortedByAmount.map((reminder, index) => {
          const heightPercent = maxAmount > 0 ? ((reminder.amount || 0) / maxAmount) * 100 : 0
          const isUrgent = !reminder.is_paid && new Date(reminder.due_date) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
          const isOverdue = !reminder.is_paid && new Date(reminder.due_date) < new Date()

          return (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex flex-col items-center gap-1 flex-shrink-0 w-14"
            >
              <div className="w-full flex flex-col items-center justify-end h-36">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPercent, 10)}%` }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className={`w-full max-w-[40px] rounded-t-lg shadow-md cursor-pointer transition-all hover:scale-110 ${
                    isOverdue
                      ? 'bg-gradient-to-t from-rose-500 to-rose-400'
                      : isUrgent
                      ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                      : 'bg-gradient-to-t from-sky-500 to-sky-400'
                  }`}
                />
              </div>

              <div className="text-center w-full">
                <span className="text-base">{extractEmoji(reminder.title)}</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full" title={reminder.title}>
                  {stripEmoji(reminder.title).substring(0, 5)}
                </p>
                {isOverdue && (
                  <span className="text-[8px] text-rose-500 font-bold">VENCIDO</span>
                )}
                {isUrgent && !isOverdue && (
                  <span className="text-[8px] text-amber-500 font-bold">HOY</span>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] pt-1">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-sky-400" />
          <span className="text-slate-500 dark:text-slate-400">Pendiente</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-amber-400" />
          <span className="text-slate-500 dark:text-slate-400">Hoy</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-rose-500" />
          <span className="text-slate-500 dark:text-slate-400">Vencido</span>
        </div>
      </div>
    </div>
  )
}