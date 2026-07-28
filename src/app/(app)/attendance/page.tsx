import { ClipboardCheck, Users, TrendingUp, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Button } from "@/components/ui/button";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { attendance } from "@/lib/mock-data";

export default function AttendancePage() {
  const avg = Math.round(attendance.reduce((s, a) => s + a.total, 0) / attendance.length);
  const last = attendance[attendance.length - 1];
  const avgVisitors = Math.round(attendance.reduce((s, a) => s + a.visitors, 0) / attendance.length);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Attendance"
        title="Service records"
        description="Track attendance across every gathering — men, women, children, and visitors."
        actions={
          <Button className="gap-2">
            <ClipboardCheck className="h-4 w-4" /> Record attendance
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Last service" value={last.total} icon={<Users />} tone="primary" index={0} />
        <StatCard label="Average attendance" value={avg} icon={<TrendingUp />} tone="success" index={1} />
        <StatCard label="Average visitors" value={avgVisitors} icon={<UserPlus />} tone="info" index={2} />
        <StatCard label="Services recorded" value={attendance.length} icon={<ClipboardCheck />} tone="gold" index={3} />
      </div>

      <AttendanceChart />
      <AttendanceTable />
    </div>
  );
}
