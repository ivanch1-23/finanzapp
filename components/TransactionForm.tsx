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
          <div className="relative grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Gasto
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex items-center justify-center gap-2 rounded-lg py-3 text-sm font-medium transition-colors ${
                type === 'income'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
              }`}
            >
              Ingreso
            </button>
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Monto</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 pl-12 pr-4 text-2xl font-medium outline-none transition-colors placeholder:font-normal placeholder:text-3xl placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-slate-400"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Descripción</label>
        <div className="relative">
          <Tag className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Descripción del gasto"
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm outline-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-slate-400"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Categoría</label>
        <CategorySelector value={category} onChange={setCategory as (cat: string) => void} />
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Fecha</label>
        <div className="relative">
          <Calendar className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm outline-none transition-colors focus:border-slate-400"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsRecurring(!isRecurring)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border py-3.5 text-sm font-medium transition-colors ${
            isRecurring
              ? 'border-slate-400 bg-slate-100 text-slate-700 dark:border-slate-500 dark:bg-slate-800 dark:text-slate-200'
              : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400'
          }`}
        >
          <Repeat className={`h-4 w-4 ${isRecurring ? 'text-slate-600 dark:text-slate-300' : ''}`} />
          {isRecurring ? 'Recurrente' : 'Marcar como recurrente'}
        </motion.button>
      </StaggerItem>

      <StaggerItem>
        <motion.button
          type="submit"
          onClick={handleSubmit}
          disabled={saving || !amount || !title}
          whileTap={{ scale: saving ? 1 : 0.98 }}
          className="w-full rounded-xl bg-slate-900 dark:bg-white py-4 text-sm font-medium text-white dark:text-slate-900 shadow-sm transition-colors hover:bg-slate-800 dark:hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
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
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                Listo
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