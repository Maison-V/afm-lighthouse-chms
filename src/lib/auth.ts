import type { Profile, ProfileStatus, UserRole } from "@/lib/types";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export { isSupabaseConfigured };

interface ProfileRow {
  id: string;
  full_name: string;
  email: string | null;
  role: UserRole;
  status: ProfileStatus;
  created_at: string | null;
}

function mapProfile(row: ProfileRow): Profile {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email ?? undefined,
    role: row.role,
    status: row.status,
    createdAt: row.created_at ?? undefined,
  };
}

/**
 * Server-side helper: returns the signed-in user's profile row, or null when
 * Supabase is not configured, nobody is signed in, or no profile exists yet.
 */
export async function getCurrentProfile(): Promise<Profile | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, email, role, status, created_at")
    .eq("id", user.id)
    .maybeSingle<ProfileRow>();

  return data ? mapProfile(data) : null;
}