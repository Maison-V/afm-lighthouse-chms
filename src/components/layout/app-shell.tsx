import { Sidebar } from "@/components/layout/sidebar";
import { Navbar, type NavbarNotification } from "@/components/layout/navbar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { Fab } from "@/components/layout/fab";
import { getCurrentProfile } from "@/lib/auth";
import { getChurchSettings, getEvents, getPendingAdmins, getVisitors } from "@/lib/data";
import { hexToHslTriplet } from "@/lib/brand";

export const dynamic = "force-dynamic";

export default async function AppShell({ children }: { children: React.ReactNode }) {
  const [profile, settings, pendingAdmins, visitors, events] = await Promise.all([
    getCurrentProfile(),
    getChurchSettings(),
    getPendingAdmins(),
    getVisitors(),
    getEvents(),
  ]);

  const notifications: NavbarNotification[] = [];
  if (profile?.role === "admin" && pendingAdmins.length > 0) {
    notifications.push({
      title: `${pendingAdmins.length} admin ${pendingAdmins.length === 1 ? "request" : "requests"} awaiting approval`,
      desc: pendingAdmins.map((p) => p.fullName || p.email).join(", "),
      href: "/settings",
    });
  }
  const recentVisitors = visitors.filter((v) => {
    const visit = new Date(`${v.firstVisit}T00:00:00`);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return visit >= weekAgo;
  }).length;
  if (recentVisitors > 0) {
    notifications.push({
      title: `${recentVisitors} new ${recentVisitors === 1 ? "visitor" : "visitors"} this week`,
      desc: "Follow-up is due within 48 hours",
      href: "/visitors",
    });
  }
  const today = new Date().toISOString().slice(0, 10);
  const nextEvent = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date))[0];
  if (nextEvent) {
    notifications.push({
      title: `Upcoming: ${nextEvent.title}`,
      desc: `${nextEvent.date} · ${nextEvent.location}`,
      href: "/events",
    });
  }

  const brandCss = settings
    ? `:root{--primary:${hexToHslTriplet(settings.brandColors.primary)};--secondary:${hexToHslTriplet(
        settings.brandColors.secondary
      )};--gold:${hexToHslTriplet(settings.brandColors.gold)};}`
    : "";

  return (
    <>
      {brandCss && <style dangerouslySetInnerHTML={{ __html: brandCss }} />}
      <div className="flex min-h-svh bg-background">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar profile={profile} notifications={notifications} />
          <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-10">
            <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">{children}</div>
          </main>
        </div>
        <BottomNav />
        <Fab />
      </div>
    </>
  );
}
