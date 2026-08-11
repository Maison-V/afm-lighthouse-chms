import { AnnouncementsManager } from "@/components/announcements/announcements-manager";
import { getAllAnnouncements } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return <AnnouncementsManager announcements={announcements} live={isSupabaseConfigured()} />;
}