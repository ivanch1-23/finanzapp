export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  amount: number
  title: string
  category: string
  transaction_date: string
  type: TransactionType
  is_recurring: boolean
  created_at: string
}

export interface Reminder {
  id: string
  user_id: string
  title: string
  due_date: string
  amount: number | null
  is_paid: boolean
  created_at: string
}

export interface Goal {
  id: string
  user_id: string
  name: string
  emoji: string
  target_amount: number
  current_amount: number
  created_at: string
}

export interface Category {
  id: string
  user_id: string
  name: string
  emoji: string
  color: string
  created_at: string
}

export const DEFAULT_CATEGORIES = [
  { name: 'Tienda', emoji: '🏪', color: '#F472B6' },
  { name: 'Personal', emoji: '👤', color: '#60A5FA' },
  { name: 'Tecnología', emoji: '💻', color: '#A78BFA' },
  { name: 'Comida', emoji: '🍔', color: '#FBBF24' },
  { name: 'Transporte', emoji: '🚗', color: '#34D399' },
  { name: 'Entretenimiento', emoji: '🎬', color: '#F87171' },
  { name: 'Salud', emoji: '💊', color: '#FB923C' },
  { name: 'Educación', emoji: '📚', color: '#38BDF8' },
  { name: 'Servicios', emoji: '📦', color: '#A3E635' },
  { name: 'Otros', emoji: '📌', color: '#94A3B8' },
] as const

export type CategoryName = string

export const EMOJI_OPTIONS = ['🏠', '🚗', '✈️', '📱', '💻', '🎮', '👕', '🎓', '💍', '🏝️', '🎁', '🎯', '💰', '🏦', '🌴', '⚽', '🎸', '📚', '💊', '👶', '🏪', '🎨', '🌟', '🔧', '📷', '🎵', '🏋️', '🛒', '💳', '🎁'] as const

export const CATEGORY_COLORS = [
  '#F472B6', '#60A5FA', '#A78BFA', '#FBBF24', '#34D399',
  '#F87171', '#FB923C', '#38BDF8', '#A3E635', '#94A3B8',
  '#E879F9', '#2DD4BF', '#F97316', '#8B5CF6', '#14B8A6'
] as const