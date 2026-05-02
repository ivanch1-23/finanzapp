'use client'

import { useState, useRef, useEffect } from 'react'
import { useReminderStore } from '@/stores/reminders'
import { isUrgent, isOverdue } from '@/lib/utils'
import { Check, AlertTriangle, Clock, Bell, Pencil, X, CalendarClock } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggerContainer, StaggerItem } from './Animations'
import { formatCOP } from './Animations'

interface Props {
  limit?: number
}

export function ReminderList({ limit }: Props = {}) {
  const reminders = useReminderStore((s) => s.reminders)
  const load = useReminderStore((s) => s.load)
  const markPaid = useReminderStore((s) => s.markPaid)
  const updateReminder = useReminderStore((s) => s.update)
  const loading = useReminderStore((s) => s.loading)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editAmount, setEditAmount] = useState('')
  const [editDueDate, setEditDueDate] = useState('')
  const longPressTimer = useRef<NodeJS.Timeout | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    if (!hasLoaded && !loading) {
      load().then(() => setHasLoaded(true))
    }
  }, [load, hasLoaded, loading])

  let sorted = [...reminders].sort((a, b) => {
    if (a.is_paid !== b.is_paid) return a.is_paid ? 1 : -1
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  })

  if (limit && limit > 0) {
    sorted = sorted.slice(0, limit)
  }

  // Don't show loading state after initial load
  if (loading && !hasLoaded) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-16 rounded-xl bg-slate-100 dark:bg-slate-700 animate-pulse"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
    )
  }

  if (sorted.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 py-8 text-center"
      >
        <CalendarClock className="h-8 w-8 text-slate-300 dark:text-slate-600 mb-3" />
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sin recordatorios</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Programa tus pagos para no olvidarlos</p>
      </motion.div>
    )
  }

  const handleTap = (r: typeof reminders[0]) => {
    if (!r.is_paid) {
      markPaid(r.id)
    }
  }

  const handleLongPressStart = (r: typeof reminders[0]) => {
    longPressTimer.current = setTimeout(() => {
      setEditingId(r.id)
      setEditTitle(r.title)
      setEditAmount(r.amount ? r.amount.toString() : '')
      setEditDueDate(r.due_date)
    }, 500)
  }

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }

  const handleSaveEdit = async () => {
    if (!editingId) return
    await updateReminder(editingId, {
      title: editTitle,
      due_date: editDueDate,
      amount: editAmount ? parseFloat(editAmount) : null,
    })
    setEditingId(null)
  }

  const handleCancelEdit = () => {
    setEditingId(null)
  }

  return (
    <>
      <StaggerContainer className="space-y-2">
        {sorted.map((r) => {
          const urgent = !r.is_paid && isUrgent(r.due_date)
          const overdue = !r.is_paid && isOverdue(r.due_date)

          const config = overdue
            ? { bg: 'bg-red-50 dark:bg-red-900/10', icon: AlertTriangle, iconBg: 'bg-red-100 dark:bg-red-900/20', iconColor: 'text-red-600 dark:text-red-400' }
            : urgent
            ? { bg: 'bg-amber-50 dark:bg-amber-900/10', icon: Clock, iconBg: 'bg-amber-100 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-400' }
            : r.is_paid
            ? { bg: 'bg-slate-50 dark:bg-slate-800/50', icon: Check, iconBg: 'bg-slate-200 dark:bg-slate-700', iconColor: 'text-slate-500 dark:text-slate-400' }
            : { bg: 'bg-white dark:bg-slate-800', icon: Bell, iconBg: 'bg-slate-100 dark:bg-slate-700', iconColor: 'text-slate-600 dark:text-slate-300' }

          const Icon = config.icon

          return (
            <StaggerItem key={r.id}>
              <motion.div
                layout={true}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`group relative flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-700 ${config.bg} p-3 transition-colors hover:border-slate-200 dark:hover:border-slate-600`}
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onTap={() => handleTap(r)}
                  onTouchStart={() => handleLongPressStart(r)}
                  onTouchEnd={handleLongPressEnd}
                  onMouseDown={() => handleLongPressStart(r)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.iconBg} ${r.is_paid ? 'opacity-50' : ''}`}
                >
                  <Icon className={`h-4 w-4 ${config.iconColor}`} />
                </motion.button>

                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-medium ${r.is_paid ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-900 dark:text-white'}`}>
                    {r.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {overdue ? 'Venció' : 'Vence'} {r.due_date}
                    {r.amount && ` · ${formatCOP(r.amount)}`}
                  </p>
                </div>

                {!r.is_paid && (
                  <div className="flex h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                )}
              </motion.div>
            </StaggerItem>
          )
        })}
      </StaggerContainer>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onClick={handleCancelEdit}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white">Editar recordatorio</h3>
                <button
                  onClick={handleCancelEdit}
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Descripción</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 px-4 text-sm outline-none focus:border-slate-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Fecha de vencimiento</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 px-4 text-sm outline-none focus:border-slate-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase">Monto (opcional)</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-3 px-4 text-sm outline-none focus:border-slate-400 transition-colors"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 py-3 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 rounded-lg bg-slate-900 dark:bg-white py-3 text-sm font-medium text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
