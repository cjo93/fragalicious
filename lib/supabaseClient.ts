import { createClient } from '@supabase/supabase-js'

// Admin client for server-side webhooks and migrations
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
)
