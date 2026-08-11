"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { ProfileStatus } from "@/lib/types";

/**
 * Approve or reject an admin registration. Only reachable from the admin
 * Settings page (already guarded by middleware + the (app) layout).
 */
async function setProfileStatus(profileId: string, status: Extract<ProfileStatus, "approved" | "rejected">) {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured yet.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({ status })
    .eq("id", profileId);

  if (error) throw new Error(error.message);

  revalidatePath("/settings");
}

export async function approveAdmin(profileId: string) {
  await setProfileStatus(profileId, "approved");
}

export async function rejectAdmin(profileId: string) {
  await setProfileStatus(profileId, "rejected");
}