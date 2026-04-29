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

export const CATEGORIES = [
  'Tienda',
  'Personal',
  'Tecnología',
  'Comida',
  'Ahorros (Cajitas)',
] as const

export type Category = (typeof CATEGORIES)[number]
