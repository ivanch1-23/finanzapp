import { createClient } from './supabase/client'
import type { Transaction, Reminder } from './types'

const supabase = createClient()

// Transactions
export async function fetchTransactions(): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data as Transaction[]) || []
}

export async function insertTransaction(tx: Omit<Transaction, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('transactions')
    .insert(tx)
    .select()
    .single()
  if (error) throw error
  return data as Transaction
}

export async function deleteTransaction(id: string) {
  const { error } = await supabase.from('transactions').delete().eq('id', id)
  if (error) throw error
}

// Reminders
export async function fetchReminders(): Promise<Reminder[]> {
  const { data, error } = await supabase
    .from('reminders')
    .select('*')
    .order('due_date', { ascending: true })
  if (error) throw error
  return (data as Reminder[]) || []
}

export async function insertReminder(r: Omit<Reminder, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('reminders')
    .insert(r)
    .select()
    .single()
  if (error) throw error
  return data as Reminder
}

export async function updateReminderPaid(id: string, isPaid: boolean) {
  const { error } = await supabase.from('reminders').update({ is_paid: isPaid }).eq('id', id)
  if (error) throw error
}

export async function deleteReminder(id: string) {
  const { error } = await supabase.from('reminders').delete().eq('id', id)
  if (error) throw error
}
