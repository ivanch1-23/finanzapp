import { createBrowserClient } from '@supabase/ssr'
import type { Transaction, Reminder } from './types'

function getClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return null
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}

// Transactions
export async function fetchTransactions(): Promise<Transaction[]> {
  const supabase = getClient()
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching transactions:', error)
    return []
  }
  return (data as Transaction[]) || []
}

export async function insertTransaction(tx: Omit<Transaction, 'id' | 'created_at'>) {
  const supabase = getClient()
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert(tx)
    .select()
    .single()

  if (error) {
    console.error('Error inserting transaction:', error)
    throw error
  }
  return data as Transaction
}

export async function deleteTransaction(id: string) {
  const supabase = getClient()
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) {
    console.error('Error deleting transaction:', error)
    throw error
  }
}

// Reminders
export async function fetchReminders(): Promise<Reminder[]> {
  const supabase = getClient()
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('due_date', { ascending: true })

  if (error) {
    console.error('Error fetching reminders:', error)
    return []
  }
  return (data as Reminder[]) || []
}

export async function insertReminder(r: Omit<Reminder, 'id' | 'created_at'>) {
  const supabase = getClient()
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { data, error } = await supabase
    .from('reminders')
    .insert(r)
    .select()
    .single()

  if (error) {
    console.error('Error inserting reminder:', error)
    throw error
  }
  return data as Reminder
}

export async function updateReminderPaid(id: string, isPaid: boolean) {
  const supabase = getClient()
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase.from('reminders').update({ is_paid: isPaid }).eq('id', id)
  if (error) {
    console.error('Error updating reminder:', error)
    throw error
  }
}

export async function deleteReminder(id: string) {
  const supabase = getClient()
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const { error } = await supabase.from('reminders').delete().eq('id', id)
  if (error) {
    console.error('Error deleting reminder:', error)
    throw error
  }
}
