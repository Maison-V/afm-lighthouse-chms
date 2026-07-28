import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-side Supabase client. Requires NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY to be set (see .env.example). Until a real
 * Supabase project is connected, every module in this app reads from
 * `src/lib/mock-data.ts` instead — swap those imports for calls through this
 * client (or the server client) once your schema is ready.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""
  );
}
