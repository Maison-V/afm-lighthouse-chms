import Link from "next/link";
import { Users, UserPlus, Cake, CalendarDays } from "lucide-react";
import { birthdayMonth } from "@/lib/utils";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { BirthdaysCard } from "@/components/dashboard/birthdays-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PrayerRequests } from "@/components/dashboard/prayer-requests";
import { getMembers, getVisitors, getAttendance, getEvents, countChurchFamily, memberFamilyStats } from "@/lib/data";
import { getCurrentProfile } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [members, visitors, attendance, events, profile] = await Promise.all([
    getMembers(),
    getVisitors(),
    getAttendance(),
    getEvents(),
    getCurrentProfile(),
  ]);

  const today = new Date();
  const dateLabel = today.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const thisMonth = String(today.getMonth() + 1).padStart(2, "0");
  const birthdays = members.filter((m) => birthdayMonth(m.birthday) === thisMonth);
  const newVisitors = visitors.filter((v) => v.followUpStatus === "new");
  const upcoming = events.filter((e) => e.date >= today.toISOString().slice(0, 10)).slice(0, 4);
  const family = members.reduce(
    (sum, m) => {
      const { spouse, children } = memberFamilyStats(m);
      return { spouse: sum.spouse + spouse, children: sum.children + children };
    },
    { spouse: 0, children: 0 }
  );

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={dateLabel}
        title={`Welcome back, ${profile?.fullName?.split(" ")[0] ?? "leader"}`}
        description="Here's how the house is doing today — attendance, ministries, and the people God has entrusted to us."
        actions={
          <Button asChild variant="gold">
            <Link href="/reports">View reports</Link>
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard
          label="Total members"
          value={countChurchFamily(members)}
          icon={<Users />}
          tone="primary"
          index={0}
          trend={{
            value:
              family.spouse + family.children > 0
                ? `${family.spouse + family.children} spouses & children`
                : `${members.filter((m) => m.status === "active").length} active`,
            direction: "up",
          }}
        />
        <StatCard
          label="New visitors"
          value={newVisitors.length}
          icon={<UserPlus />}
          tone="info"
          index={1}
          trend={{ value: "Awaiting follow-up", direction: "flat" }}
        />
        <StatCard label="Birthdays this month" value={birthdays.length} icon={<Cake />} tone="gold" index={2} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AttendanceChart data={attendance} />
        </div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <UpcomingEvents events={upcoming} />
        <BirthdaysCard members={birthdays} />
        <PrayerRequests visitors={visitors} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity
            items={[
              {
                icon: CalendarDays,
                tone: "text-primary bg-primary/10",
                text: `${events.length} event${events.length === 1 ? "" : "s"} on the calendar${events.length > 0 ? ` — next: ${events[0].title}` : ""}`,
                time: "Upcoming",
              },
              {
                icon: UserPlus,
                tone: "text-info bg-info/10",
                text: `${visitors.length} visitor${visitors.length === 1 ? "" : "s"} on record, ${newVisitors.length} awaiting follow-up`,
                time: "This month",
              },
              {
                icon: Cake,
                tone: "text-gold bg-gold/15",
                text: `${birthdays.length} birthday${birthdays.length === 1 ? "" : "s"} to celebrate this month`,
                time: `${thisMonth}`,
              },
              {
                icon: Users,
                tone: "text-success bg-success/10",
                text:
                  attendance.length > 0
                    ? `${attendance[attendance.length - 1].total} attended the last recorded service`
                    : "No attendance recorded yet — capture the next service",
                time: "Latest record",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
