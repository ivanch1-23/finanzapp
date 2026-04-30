'use client'

import { create } from 'zustand'
import type { Transaction } from '@/lib/types'
import { fetchTransactions, insertTransaction, deleteTransaction } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'

async function getUserId(): Promise<string | null> {
  try {
    const supabase = createClient()
    if (!supabase) return null
    const { data: { user } } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

interface TransactionState {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  initialized: boolean
  lastUserId: string | null
  load: () => Promise<void>
  add: (tx: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>
  remove: (id: string) => Promise<void>
  reset: () => void
}

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  transactions: [],
  loading: false,
  error: null,
  initialized: false,
  lastUserId: null,
  load: async () => {
    const currentUserId = await getUserId()
    const state = get()

    // Si ya inicializamos para este mismo usuario y tenemos datos, no recargar
    if (state.initialized && state.lastUserId === currentUserId && state.transactions.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await fetchTransactions(currentUserId ?? undefined)
      set({ transactions: data, loading: false, initialized: true, lastUserId: currentUserId })
    } catch (e: any) {
      set({ error: e.message, loading: false, initialized: true, lastUserId: currentUserId })
    }
  },
  add: async (tx) => {
    try {
      const userId = await getUserId()
      if (!userId) {
        throw new Error('Usuario no autenticado')
      }
      const created = await insertTransaction({ ...tx, user_id: userId })
      set((state) => ({ transactions: [created, ...state.transactions] }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  remove: async (id) => {
    try {
      await deleteTransaction(id)
      set((state) => ({
        transactions: state.transactions.filter((t) => t.id !== id),
      }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  reset: () => {
    set({ transactions: [], initialized: false, lastUserId: null, error: null })
  },
}))