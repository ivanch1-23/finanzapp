'use client'

import { create } from 'zustand'
import type { Category } from '@/lib/types'
import { fetchCategories, insertCategory, deleteCategory } from '@/lib/api'
import { createClient } from '@/lib/supabase/client'
import { DEFAULT_CATEGORIES } from '@/lib/types'

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

interface CategoryState {
  categories: Category[]
  loading: boolean
  error: string | null
  initialized: boolean
  load: () => Promise<void>
  add: (c: Omit<Category, 'id' | 'created_at'>) => Promise<void>
  remove: (id: string) => Promise<void>
  getAllWithDefaults: () => (Category & { isDefault?: boolean })[]
}

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  loading: false,
  error: null,
  initialized: false,
  load: async () => {
    if (get().initialized) return

    set({ loading: true, error: null })
    try {
      const userId = await getUserId()
      const data = await fetchCategories(userId ?? undefined)
      set({ categories: data, loading: false, initialized: true })
    } catch (e: any) {
      set({ error: e.message, loading: false, initialized: true })
    }
  },
  add: async (c) => {
    try {
      const userId = await getUserId()
      if (!userId) {
        throw new Error('Usuario no autenticado')
      }
      const created = await insertCategory({ ...c, user_id: userId })
      set((state) => ({ categories: [...state.categories, created] }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  remove: async (id) => {
    try {
      await deleteCategory(id)
      set((state) => ({
        categories: state.categories.filter(c => c.id !== id),
      }))
    } catch (e: any) {
      set({ error: e.message })
    }
  },
  getAllWithDefaults: () => {
    const userCategories = get().categories
    const defaults = DEFAULT_CATEGORIES.map(c => ({
      id: `default-${c.name}`,
      user_id: '',
      name: c.name,
      emoji: c.emoji,
      color: c.color,
      created_at: '',
      isDefault: true,
    }))
    return [...defaults, ...userCategories]
  },
}))