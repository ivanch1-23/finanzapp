'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useTransactionStore } from '@/stores/transactions'
import { useAuth } from '@/contexts/AuthContext'
import { DEFAULT_CATEGORIES } from '@/lib/types'
import type { TransactionType } from '@/lib/types'
import { DollarSign, Tag, Calendar, Repeat, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggerContainer, StaggerItem } from './Animations'
import { CategorySelector } from './CategorySelector'

export function TransactionForm() {
  const router = useRouter()
  const { user } = useAuth()
  const [amount, setAmount] = useState('')
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>(DEFAULT_CATEGORIES[0].name)
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [type, setType] = useState<TransactionType>('expense')
  const [isRecurring, setIsRecurring] = useState(false)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  const add = useTransactionStore((s) => s.add)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !title) return
    setSaving(true)

    await add({
      user_id: user?.id || '00000000-0000-0000-0000-000000000000',
      amount: parseFloat(amount),
      title,
      category,
      transaction_date: date,
      type,
      is_recurring: isRecurring,
    })

    setSaving(false)
    setSuccess(true)
    setTimeout(() => {
      router.replace('/')
    }, 500)
  }

  return (
    <StaggerContainer className="space-y-5">
      <StaggerItem>
        <div className="relative overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5">
          <motion.div
            layoutId="typeIndicator"
            className="absolute inset-y-1.5 left-1.5 rounded-xl bg-white dark:bg-slate-700 shadow-sm"
            style={{ width: 'calc(50% - 6px)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
          <div className="relative grid grid-cols-2 gap-1">
            {(['expense', 'income'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`relative z-10 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold transition-colors ${
                  type === t
                    ? t === 'expense' ? 'text-sky-600 dark:text-sky-400' : 'text-teal-600 dark:text-teal-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {t === 'expense' ? '↓ Gasto' : '↑ Ingreso'}
              </button>
            ))}
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Monto</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 pl-12 pr-4 text-2xl font-bold outline-none transition-all placeholder:font-normal placeholder:text-3xl placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Descripción</label>
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Descripción del gasto"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Categoría</label>
        <CategorySelector value={category} onChange={setCategory as (cat: string) => void} />
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Fecha</label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={() => setIsRecurring(!isRecurring)}
          className={`flex w-full items-center justify-center gap-2 rounded-2xl border py-3.5 text-sm font-bold transition-all ${
            isRecurring
              ? 'border-sky-400 bg-sky-100 text-sky-600 dark:border-sky-500 dark:bg-sky-900/30 dark:text-sky-400'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          <Repeat className={`h-4 w-4 ${isRecurring ? 'text-sky-500' : ''}`} />
          {isRecurring ? '✓ Recurrente activado' : 'Marcar como recurrente'}
        </motion.button>
      </StaggerItem>

      <StaggerItem>
        <motion.button
          type="submit"
          onClick={handleSubmit}
          disabled={saving || !amount || !title}
          whileTap={{ scale: saving ? 1 : 0.97 }}
          className={`w-full rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all ${
            type === 'expense'
              ? 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700'
              : 'bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
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
              >
                ✓ Redirigiendo...
              </motion.span>
            ) : (
              <motion.span
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Guardar {type === 'expense' ? 'gasto' : 'ingreso'}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </StaggerItem>
    </StaggerContainer>
  )
}