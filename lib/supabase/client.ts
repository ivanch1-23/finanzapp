import { createBrowserClient } from '@supabase/ssr'

let supabaseClient: ReturnType<typeof createBrowserClient> | null = null

export function createClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables')
    return null
  }

  const cleanUrl = supabaseUrl.trim()

  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    console.warn('Invalid Supabase URL format:', cleanUrl)
    return null
  }

  try {
    supabaseClient = createBrowserClient(cleanUrl, supabaseAnonKey)
    return supabaseClient
  } catch (error) {
    console.warn('Failed to create Supabase client:', error)
    return null
  }
}

export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL
}

export function getSupabaseAnonKey() {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}