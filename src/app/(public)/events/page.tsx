import { EventsAdminView } from "@/components/events/events-admin-view";
import { EventsPublicView } from "@/components/events/events-public-view";
import { getCurrentProfile } from "@/lib/auth";

export default async function EventsPage() {
  const profile = await getCurrentProfile();

  if (profile?.role === "admin") {
    return <EventsAdminView />;
  }

  return <EventsPublicView />;
}