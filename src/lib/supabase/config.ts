/**
 * Pure env check — safe to import from both client and server code.
 * Everything in this file must stay free of server-only imports.
 */
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}