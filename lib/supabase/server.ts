import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Simple server-side client factory. This is intended for API routes that
// rely on session cookies managed by Supabase Auth Helpers in Next.js.
// If you need proper request-scoped auth, swap to a context-aware wrapper.
export function createClient() {
  const url = process.env.SUPABASE_URL as string
  const anonKey = process.env.SUPABASE_ANON_KEY as string
  if (!url || !anonKey) {
    throw new Error('Supabase URL or ANON key not configured')
  }
  return createSupabaseClient(url, anonKey)
}
