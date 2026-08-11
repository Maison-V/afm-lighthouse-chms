import MinistriesAdminView from "@/components/ministries/ministries-admin-view";
import MinistriesPublicView from "@/components/ministries/ministries-public-view";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function MinistriesPage() {
  const profile = await getCurrentProfile();

  if (profile?.role === "admin") {
    return <MinistriesAdminView />;
  }

  return <MinistriesPublicView />;
}