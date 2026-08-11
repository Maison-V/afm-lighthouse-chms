import type { Announcement, AnnouncementCategory } from "@/lib/types";
import { announcements as mockAnnouncements } from "@/lib/mock-data";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  category: AnnouncementCategory;
  starts_at: string;
  ends_at: string | null;
  published: boolean;
}

export function mapAnnouncement(row: AnnouncementRow): Announcement {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    category: row.category,
    startsAt: row.starts_at,
    endsAt: row.ends_at ?? undefined,
    published: row.published,
  };
}

/**
 * Published announcements for the public site and member view. Falls back to
 * mock data until Supabase is configured.
 */
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) return mockAnnouncements;

  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, category, starts_at, ends_at, published")
    .eq("published", true)
    .order("starts_at", { ascending: false });

  return (data ?? []).map(mapAnnouncement);
}

/**
 * All announcements (including unpublished) for the admin manager.
 */
export async function getAllAnnouncements(): Promise<Announcement[]> {
  if (!isSupabaseConfigured()) return mockAnnouncements;

  const supabase = await createClient();
  const { data } = await supabase
    .from("announcements")
    .select("id, title, body, category, starts_at, ends_at, published")
    .order("starts_at", { ascending: false });

  return (data ?? []).map(mapAnnouncement);
}