'use client'

import { useState, useRef } from 'react'
import { useReminderStore } from '@/stores/reminders'
import { useEffect } from 'react'
import { isUrgent, isOverdue } from '@/lib/utils'
import { Check, AlertTriangle, Clock, Bell, Pencil, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggerContainer, StaggerItem } from './Animations'
import { formatCOP } from './Animations'
import { Loader2 } from 'lucide-react'

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

  useEffect(() => {
    load()
  }, [load])

  let sorted = [...reminders].sort((a, b) => {
    if (a.is_paid !== b.is_paid) return a.is_paid ? 1 : -1
    return new Date(a.due_date).getTime() - new Date(b.due_date).getTime()
  })

  if (limit && limit > 0) {
    sorted = sorted.slice(0, limit)
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="h-20 rounded-2xl bg-slate-200 dark:bg-slate-700 animate-pulse"
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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-10 text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/30"
        >
          <Bell className="h-6 w-6 text-sky-500" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-4 text-sm font-semibold text-slate-600 dark:text-slate-300"
        >
          Sin recordatorios
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-1 text-xs text-slate-500 dark:text-slate-400"
        >
          Programa tus pagos para no olvidarlos
        </motion.p>
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
      <StaggerContainer className="space-y-3">
        {sorted.map((r) => {
          const urgent = !r.is_paid && isUrgent(r.due_date)
          const overdue = !r.is_paid && isOverdue(r.due_date)

          const config = overdue
            ? { bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-800', icon: AlertTriangle, iconBg: 'bg-rose-100 dark:bg-rose-900/30', iconColor: 'text-rose-500', dot: 'bg-rose-500' }
            : urgent
            ? { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', icon: Clock, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-500', dot: 'bg-amber-500' }
            : r.is_paid
            ? { bg: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700', icon: Check, iconBg: 'bg-teal-100 dark:bg-teal-900/30', iconColor: 'text-teal-500', dot: 'bg-teal-500' }
            : { bg: 'bg-white dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', icon: Bell, iconBg: 'bg-sky-100 dark:bg-sky-900/30', iconColor: 'text-sky-500', dot: 'bg-sky-500' }

          const Icon = config.icon

          return (
            <StaggerItem key={r.id}>
              <motion.div
                layout={true}
                initial={{ opacity: 0, y: 12, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -12, scale: 0.95 }}
                className={`group relative overflow-hidden rounded-2xl border ${config.bg} ${config.border} shadow-sm transition-shadow hover:shadow-md`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.dot}`} />

                <div className="flex items-center gap-3 p-4 pl-3">
                  {/* Icon/emoji - tap to mark paid, long press to edit */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onTap={() => handleTap(r)}
                    onTouchStart={() => handleLongPressStart(r)}
                    onTouchEnd={handleLongPressEnd}
                    onMouseDown={() => handleLongPressStart(r)}
                    onMouseUp={handleLongPressEnd}
                    onMouseLeave={handleLongPressEnd}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconBg} ${r.is_paid ? 'opacity-50' : ''} shadow-sm`}
                  >
                    {r.is_paid ? (
                      <Check className={`h-6 w-6 ${config.iconColor}`} />
                    ) : (
                      <Icon className={`h-6 w-6 ${config.iconColor}`} />
                    )}
                  </motion.button>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-bold ${r.is_paid ? 'line-through opacity-60' : ''}`}>
                      {r.title}
                    </p>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {overdue ? 'Venció' : 'Vence'} {r.due_date}
                      {r.amount && ` · ${formatCOP(r.amount)}`}
                    </p>
                  </div>

                  {/* Status indicator */}
                  {!r.is_paid && (
                    <div className="flex h-2 w-2 rounded-full bg-sky-400" />
                  )}
                </div>
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
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-bold">Editar recordatorio</h3>
                <button
                  onClick={handleCancelEdit}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Descripción</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-sm font-medium outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Fecha de vencimiento</label>
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-sm font-medium outline-none focus:border-sky-400"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Monto (opcional)</label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3 px-4 text-sm font-medium outline-none focus:border-sky-400"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3 text-sm font-bold text-white"
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
