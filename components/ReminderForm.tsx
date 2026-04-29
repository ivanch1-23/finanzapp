'use client'

import { useState } from 'react'
import { useReminderStore } from '@/stores/reminders'
import { Bell, Calendar, DollarSign, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggerContainer, StaggerItem } from './Animations'

export function ReminderForm() {
  const [title, setTitle] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const add = useReminderStore((s) => s.add)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !dueDate) return
    setSaving(true)

    await add({
      user_id: '00000000-0000-0000-0000-000000000000',
      title,
      due_date: dueDate,
      amount: amount ? parseFloat(amount) : null,
      is_paid: false,
    })

    setSaving(false)
    setSuccess(true)
    setTimeout(() => setSuccess(false), 2000)
    setTitle('')
    setDueDate('')
    setAmount('')
  }

  return (
    <StaggerContainer className="space-y-4">
      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Descripción</label>
        <div className="relative">
          <Bell className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="💡 Pago de servicios"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fecha de vencimiento</label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Monto (opcional)</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:font-medium placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <motion.button
          type="submit"
          onClick={handleSubmit}
          disabled={saving || !title || !dueDate}
          whileTap={{ scale: saving ? 1 : 0.97 }}
          className="w-full rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-500 py-4 text-sm font-bold text-white shadow-lg transition-all hover:from-sky-600 hover:to-cyan-600 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <AnimatePresence mode="wait">
            {saving ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </motion.span>
            ) : success ? (
              <motion.span
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-2"
              >
                ✓ ¡Listo!
              </motion.span>
            ) : (
              <motion.span
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Crear recordatorio
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </StaggerItem>
    </StaggerContainer>
  )
}
