import { createClient as createBrowserClient } from './supabase/client'
import { createClient as createServerClient } from './supabase/server'

export async function getUser() {
  if (typeof window !== 'undefined') {
    const supabase = createBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  }
  const supabase = createServerClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}
