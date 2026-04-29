'use client'

import { create } from 'zustand'
import type { Goal } from '@/lib/types'
import { fetchGoals, insertGoal, updateGoal, deleteGoal } from '@/lib/api'
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

interface GoalState {
  goals: Goal[]
  loading: boolean
  error: string | null
  initialized: boolean
  load: () => Promise<void>
  add: (g: Omit<Goal, 'id' | 'created_at'>) => Promise<void>
  updateAmount: (id: string, amount: number) => Promise<void>
  update: (id: string, data: { name?: string; emoji?: string; target_amount?: number }) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useGoalStore = create<GoalState>()((set, get) => ({
  goals: [],
  loading: false,
  error: null,
  initialized: false,
  load: async () => {
    if (get().initialized && get().goals.length > 0) return

    set({ loading: true, error: null })
    try {
      const userId = await getUserId()
      const data = await fetchGoals(userId ?? undefined)
      set({ goals: data, loading: false, initialized: true })
    } catch (e: any) {
      set({ error: e.message, loading: false, initialized: true })
    }
  },
  add: async (g) => {
    try {
      const userId = await getUserId()
      if (!userId) {
        throw new Error('Usuario no autenticado')
      }
      const created = await insertGoal({ ...g, user_id: userId })
      set((state) => ({ goals: [created, ...state.goals] }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  updateAmount: async (id, amount) => {
    try {
      const goal = get().goals.find(g => g.id === id)
      if (!goal) return
      const newAmount = goal.current_amount + amount
      await updateGoal(id, { current_amount: newAmount })
      set((state) => ({
        goals: state.goals.map(g =>
          g.id === id ? { ...g, current_amount: newAmount } : g
        ),
      }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  update: async (id, data) => {
    try {
      await updateGoal(id, data)
      set((state) => ({
        goals: state.goals.map(g =>
          g.id === id ? { ...g, ...data } : g
        ),
      }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  remove: async (id) => {
    try {
      await deleteGoal(id)
      set((state) => ({
        goals: state.goals.filter(g => g.id !== id),
      }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
}))