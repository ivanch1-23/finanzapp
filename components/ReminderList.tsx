'use client'

import { useEffect } from 'react'
import { useReminderStore } from '@/stores/reminders'
import { isUrgent, isOverdue } from '@/lib/utils'
import { Check, AlertTriangle, Clock, Bell } from 'lucide-react'
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
  const loading = useReminderStore((s) => s.loading)

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 py-12 text-center"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-100 dark:bg-sky-900/30"
        >
          <Bell className="h-7 w-7 text-sky-500" />
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

  return (
    <StaggerContainer className="space-y-3">
      {sorted.map((r) => {
        const urgent = !r.is_paid && isUrgent(r.due_date)
        const overdue = !r.is_paid && isOverdue(r.due_date)

        const config = overdue
          ? { bg: 'bg-rose-50 dark:bg-rose-950/20', border: 'border-rose-200 dark:border-rose-800', icon: AlertTriangle, iconBg: 'bg-rose-100 dark:bg-rose-900/30', iconColor: 'text-rose-500', dot: 'bg-rose-500', label: 'Vencido' }
          : urgent
          ? { bg: 'bg-amber-50 dark:bg-amber-950/20', border: 'border-amber-200 dark:border-amber-800', icon: Clock, iconBg: 'bg-amber-100 dark:bg-amber-900/30', iconColor: 'text-amber-500', dot: 'bg-amber-500', label: 'Próximo' }
          : r.is_paid
          ? { bg: 'bg-slate-50 dark:bg-slate-800/50', border: 'border-slate-200 dark:border-slate-700', icon: Check, iconBg: 'bg-teal-100 dark:bg-teal-900/30', iconColor: 'text-teal-500', dot: 'bg-teal-500', label: 'Pagado' }
          : { bg: 'bg-white dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', icon: Bell, iconBg: 'bg-sky-100 dark:bg-sky-900/30', iconColor: 'text-sky-500', dot: 'bg-sky-500', label: 'Pendiente' }

        const Icon = config.icon

        return (
          <StaggerItem key={r.id}>
            <motion.div
              layout={true}
              initial={{ opacity: 0, y: 12, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.95 }}
              className={`group relative overflow-hidden rounded-2xl border ${config.bg} ${config.border} p-4 shadow-sm transition-shadow hover:shadow-md`}
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${config.dot}`} />

              <div className="flex items-center gap-4 pl-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${config.iconBg} ${config.iconColor} shadow-sm`}
                >
                  <Icon className="h-6 w-6" />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${r.is_paid ? 'line-through opacity-60' : ''}`}>
                      {r.title}
                    </p>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${config.iconBg} ${config.iconColor}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {overdue ? 'Venció' : 'Vence'} {r.due_date}
                    {r.amount && ` · ${formatCOP(r.amount)}`}
                  </p>
                </div>

                <AnimatePresence>
                  {!r.is_paid && (
                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => markPaid(r.id)}
                      className="flex h-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 px-4 text-xs font-bold text-white shadow-sm transition-shadow hover:shadow-md"
                    >
                      <Check className="mr-1.5 h-3.5 w-3.5" />
                      Pagar
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </StaggerItem>
        )
      })}
    </StaggerContainer>
  )
}
