'use client'

import { motion } from 'framer-motion'
import { useReminderStore } from '@/stores/reminders'
import { useEffect } from 'react'
import { formatCOP } from './Animations'
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

      <div className="flex items-end justify-around gap-3 h-48 px-2 py-3 bg-gradient-to-t from-slate-50 to-transparent dark:from-slate-800/30 rounded-xl">
        {sortedByAmount.map((reminder, index) => {
          const heightPercent = maxAmount > 0 ? ((reminder.amount || 0) / maxAmount) * 100 : 0
          const isUrgent = !reminder.is_paid && new Date(reminder.due_date) <= new Date(Date.now() + 24 * 60 * 60 * 1000)
          const isOverdue = !reminder.is_paid && new Date(reminder.due_date) < new Date()

          return (
            <div key={reminder.id} className="flex flex-col items-center gap-2 flex-1 max-w-[60px]">
              <div className="w-full flex flex-col items-center justify-end h-36">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(heightPercent, 10)}%` }}
                  transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className={`w-10 rounded-t-lg shadow-lg relative cursor-pointer transition-transform hover:scale-105 ${
                    isOverdue
                      ? 'bg-gradient-to-t from-rose-500 to-rose-400'
                      : isUrgent
                      ? 'bg-gradient-to-t from-amber-500 to-amber-400'
                      : 'bg-gradient-to-t from-sky-500 to-sky-400'
                  }`}
                >
                  {showLabels && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded whitespace-nowrap font-bold">
                      ${Math.round((reminder.amount || 0) / 1000)}k
                    </div>
                  )}
                </motion.div>
              </div>

              <div className="text-center w-full">
                <span className="text-lg">{extractEmoji(reminder.title)}</span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate w-full mt-1" title={reminder.title}>
                  {stripEmoji(reminder.title).substring(0, 6)}
                </p>
                {isOverdue && (
                  <span className="text-[8px] text-rose-500 font-bold">VENCIDO</span>
                )}
                {isUrgent && !isOverdue && (
                  <span className="text-[8px] text-amber-500 font-bold">HOY</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-center gap-4 text-[10px] pt-2">
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