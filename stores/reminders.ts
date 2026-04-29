'use client'

import { create } from 'zustand'
import type { Reminder } from '@/lib/types'
import { fetchReminders, insertReminder, updateReminderPaid, updateReminder, deleteReminder } from '@/lib/api'
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

interface ReminderState {
  reminders: Reminder[]
  loading: boolean
  error: string | null
  initialized: boolean
  load: () => Promise<void>
  add: (r: Omit<Reminder, 'id' | 'created_at'>) => Promise<void>
  markPaid: (id: string) => Promise<void>
  update: (id: string, data: { title?: string; due_date?: string; amount?: number | null }) => Promise<void>
  remove: (id: string) => Promise<void>
}

export const useReminderStore = create<ReminderState>()((set, get) => ({
  reminders: [],
  loading: false,
  error: null,
  initialized: false,
  load: async () => {
    if (get().initialized && get().reminders.length > 0) return

    set({ loading: true, error: null })
    try {
      const userId = await getUserId()
      const data = await fetchReminders(userId ?? undefined)
      set({ reminders: data, loading: false, initialized: true })
    } catch (e: any) {
      set({ error: e.message, loading: false, initialized: true })
    }
  },
  add: async (r) => {
    try {
      const userId = await getUserId()
      if (!userId) {
        throw new Error('Usuario no autenticado')
      }
      const created = await insertReminder({ ...r, user_id: userId })
      set((state) => ({ reminders: [created, ...state.reminders] }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  markPaid: async (id) => {
    try {
      await updateReminderPaid(id, true)
      set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, is_paid: true } : r
        ),
      }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  update: async (id, data) => {
    try {
      await updateReminder(id, data)
      set((state) => ({
        reminders: state.reminders.map((r) =>
          r.id === id ? { ...r, ...data } : r
        ),
      }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  remove: async (id) => {
    try {
      await deleteReminder(id)
      set((state) => ({
        reminders: state.reminders.filter((r) => r.id !== id),
      }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
}))