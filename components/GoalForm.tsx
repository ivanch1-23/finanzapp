'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGoalStore } from '@/stores/goals'
import { useAuth } from '@/contexts/AuthContext'
import { EMOJI_OPTIONS } from '@/lib/types'
import { Target, DollarSign, Loader2, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { StaggerContainer, StaggerItem } from './Animations'

interface GoalFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function GoalForm({ onSuccess, onCancel }: GoalFormProps) {
  const router = useRouter()
  const { user } = useAuth()
  const add = useGoalStore((s) => s.add)
  const [name, setName] = useState('')
  const [emoji, setEmoji] = useState<string>(EMOJI_OPTIONS[0])
  const [targetAmount, setTargetAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !targetAmount) return

    setSaving(true)
    setError('')

    let success = false
    try {
      await add({
        user_id: user?.id || '',
        name,
        emoji,
        target_amount: parseFloat(targetAmount),
        current_amount: 0,
      })
      success = true
    } catch (err: any) {
      console.error('Goal creation error:', err)
      setError(err.message || 'Error al crear la meta')
    }

    setSaving(false)

    if (success && !error) {
      if (onSuccess) {
        onSuccess()
      } else {
        setTimeout(() => {
          router.replace('/ahorros')
        }, 300)
      }
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    }
  }

  return (
    <StaggerContainer className="space-y-5">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400"
        >
          {error}
        </motion.div>
      )}

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Nombre de la meta</label>
        <div className="relative">
          <Target className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Vacaciones, Carro, Casa..."
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Emoji</label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="flex items-center justify-center w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 text-2xl transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            {emoji}
          </button>

          <AnimatePresence>
            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute z-10 mt-2 p-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl w-full"
              >
                <div className="grid grid-cols-5 gap-2">
                  {EMOJI_OPTIONS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => {
                        setEmoji(e)
                        setShowEmojiPicker(false)
                      }}
                      className={`p-2 text-xl rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all ${emoji === e ? 'bg-sky-100 dark:bg-sky-900/30' : ''}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </StaggerItem>

      <StaggerItem>
        <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Meta de ahorro</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="number"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0"
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 pl-12 pr-4 text-xl font-bold outline-none transition-all placeholder:font-normal placeholder:text-3xl placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
          />
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 rounded-2xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold"
          >
            Cancelar
          </button>
          <motion.button
            type="submit"
            onClick={handleSubmit}
            disabled={saving || !name || !targetAmount}
            whileTap={{ scale: saving ? 1 : 0.97 }}
            className="flex-1 rounded-2xl py-4 text-sm font-bold text-white shadow-lg transition-all bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Creando...
              </span>
            ) : (
              'Crear meta'
            )}
          </motion.button>
        </div>
      </StaggerItem>
    </StaggerContainer>
  )
}

interface AddSavingsFormProps {
  goalId: string
  goalName: string
  onClose: () => void
}

export function AddSavingsForm({ goalId, goalName, onClose }: AddSavingsFormProps) {
  const updateAmount = useGoalStore((s) => s.updateAmount)
  const [amount, setAmount] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || parseFloat(amount) <= 0) return

    setSaving(true)
    setError('')

    try {
      await updateAmount(goalId, parseFloat(amount))
      setSuccess(true)
      setTimeout(onClose, 600)
    } catch (err: any) {
      setError(err.message || 'Error al agregar ahorro')
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-slate-800 p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Agregar a "{goalName}"</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase text-slate-500">Cantidad</label>
            <div className="relative">
              <DollarSign className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                autoFocus
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-4 pl-12 pr-4 text-2xl font-bold outline-none transition-all placeholder:font-normal placeholder:text-3xl placeholder:text-slate-300 dark:placeholder:text-slate-600 focus:border-sky-400 focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900/30"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 py-3 text-sm font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving || !amount || parseFloat(amount) <= 0}
              className="flex-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 py-3 text-sm font-bold text-white disabled:opacity-50"
            >
              {saving ? 'Guardando...' : success ? '✓' : 'Agregar'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}