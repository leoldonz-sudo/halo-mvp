// Server-only Supabase admin client (service_role key).
//
// SECURITY: this module must only be imported by server code (API route
// handlers). It reads SUPABASE_SERVICE_ROLE_KEY, which is NOT a NEXT_PUBLIC_*
// var, so Next.js strips it from any client bundle — the key never reaches the
// browser. The browser talks only to our /api/share routes, never to Supabase.

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null | undefined;

/** True when both Supabase env vars are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Returns a service-role Supabase client, or `null` when env vars are missing.
 * Callers that get `null` should fall back to the localStorage behavior.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    cached = null;
    return null;
  }
  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}
