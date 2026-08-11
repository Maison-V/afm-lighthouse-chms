import AppShell from "@/components/layout/app-shell";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { getCurrentProfile } from "@/lib/auth";

/**
 * Adaptive layout for the community URLs (/ , /events, /ministries).
 * Guests and members get the public site chrome; approved admins get the
 * full management AppShell around the same URL.
 */
export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  if (profile?.role === "admin") {
    return <AppShell>{children}</AppShell>;
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader profile={profile} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}