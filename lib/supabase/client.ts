import { createBrowserClient } from '@supabase/ssr'

/**
 * Browser-side Supabase client.
 * Call createClient() inside client components — creates a new instance each time,
 * which is fine for Next.js App Router client components.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
