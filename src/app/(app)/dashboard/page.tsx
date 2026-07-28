import { Users, UserPlus, Cake, Wallet } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { OfferingSummary } from "@/components/dashboard/offering-summary";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { BirthdaysCard } from "@/components/dashboard/birthdays-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { PrayerRequests } from "@/components/dashboard/prayer-requests";
import { dashboardStats } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

export default function DashboardPage() {
  const today = new Date("2026-07-26");
  const dateLabel = today.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow={dateLabel}
        title="Welcome back, Pastor Kabelo"
        description="Here's how the house is doing today — attendance, giving, and the people God has entrusted to us."
        actions={<Button variant="gold">Generate weekly report</Button>}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total members" value={dashboardStats.totalMembers} icon={<Users />} tone="primary" index={0} trend={{ value: `${dashboardStats.activeMembers} active`, direction: "up" }} />
        <StatCard label="New visitors" value={dashboardStats.newVisitorsThisMonth} icon={<UserPlus />} tone="info" index={1} trend={{ value: "Awaiting follow-up", direction: "flat" }} />
        <StatCard label="Birthdays this month" value={dashboardStats.birthdaysThisMonth.length} icon={<Cake />} tone="gold" index={2} />
        <StatCard label="Offering this month" value={formatCurrency(dashboardStats.offeringThisMonth)} icon={<Wallet />} tone="success" index={3} trend={{ value: "+12% vs last month", direction: "up" }} />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AttendanceChart />
        <OfferingSummary />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <UpcomingEvents />
        <BirthdaysCard />
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <PrayerRequests />
      </div>
    </div>
  );
}
