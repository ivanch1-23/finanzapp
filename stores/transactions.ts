'use client'

import { create } from 'zustand'
import type { Transaction } from '@/lib/types'
import { fetchTransactions, insertTransaction, deleteTransaction } from '@/lib/api'

interface TransactionState {
  transactions: Transaction[]
  loading: boolean
  error: string | null
  initialized: boolean
  load: () => Promise<void>
  add: (tx: Omit<Transaction, 'id' | 'created_at'>) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useTransactionStore = create<TransactionState>()((set, get) => ({
  transactions: [],
  loading: false,
  error: null,
  initialized: false,
  load: async () => {
    // Don't refetch if already initialized with data
    if (get().initialized && get().transactions.length > 0) return

    set({ loading: true, error: null })
    try {
      const data = await fetchTransactions()
      set({ transactions: data, loading: false, initialized: true })
    } catch (e: any) {
      set({ error: e.message, loading: false, initialized: true })
    }
  },
  add: async (tx) => {
    try {
      const created = await insertTransaction(tx)
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
}))
