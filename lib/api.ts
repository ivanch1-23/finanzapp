import { createBrowserClient } from '@supabase/ssr'
import type { Transaction, Reminder } from './types'
import { createClient as createSupabaseClient } from './supabase/client'

function getClient() {
  return createSupabaseClient()
}

// Transactions
export async function fetchTransactions(userId?: string): Promise<Transaction[]> {
  const supabase = getClient()
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  let query = supabase.from('transactions').select('*').order('created_at', { ascending: false })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

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
export async function fetchReminders(userId?: string): Promise<Reminder[]> {
  const supabase = getClient()
  if (!supabase) {
    console.warn('Supabase not configured, returning empty array')
    return []
  }

  let query = supabase.from('reminders').select('*').order('due_date', { ascending: true })

  if (userId) {
    query = query.eq('user_id', userId)
  }

  const { data, error } = await query

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

export async function updateReminder(id: string, data: { title?: string; due_date?: string; amount?: number | null }) {
  const supabase = getClient()
  if (!supabase) {
    throw new Error('Supabase not configured')
  }

  const updateData: Record<string, unknown> = {}
  if (data.title !== undefined) updateData.title = data.title
  if (data.due_date !== undefined) updateData.due_date = data.due_date
  if (data.amount !== undefined) updateData.amount = data.amount

  const { error } = await supabase.from('reminders').update(updateData).eq('id', id)
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