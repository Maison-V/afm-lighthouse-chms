import { ClipboardCheck, Users, TrendingUp, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { RecordAttendanceDialog } from "@/components/attendance/record-attendance-dialog";
import { AttendanceChart } from "@/components/dashboard/attendance-chart";
import { AttendanceTable } from "@/components/attendance/attendance-table";
import { getAttendance } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AttendancePage() {
  const attendance = await getAttendance();

  const avg = attendance.length > 0 ? Math.round(attendance.reduce((s, a) => s + a.total, 0) / attendance.length) : 0;
  const last = attendance[attendance.length - 1];
  const avgVisitors =
    attendance.length > 0 ? Math.round(attendance.reduce((s, a) => s + a.visitors, 0) / attendance.length) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Attendance"
        title="Service records"
        description={
          attendance.length === 0
            ? "No services recorded yet — capture the first count after your next gathering."
            : "Track attendance across every gathering — men, women, children, and visitors."
        }
        actions={<RecordAttendanceDialog />}
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Last service" value={last?.total ?? "—"} icon={<Users />} tone="primary" index={0} />
        <StatCard label="Average attendance" value={avg} icon={<TrendingUp />} tone="success" index={1} />
        <StatCard label="Average visitors" value={avgVisitors} icon={<UserPlus />} tone="info" index={2} />
        <StatCard label="Services recorded" value={attendance.length} icon={<ClipboardCheck />} tone="gold" index={3} />
      </div>

      {attendance.length === 0 ? (
        <EmptyState
          icon={ClipboardCheck}
          title="No attendance records yet"
          description="Hit 'Record attendance' after your next service to start the trend."
        />
      ) : (
        <>
          <AttendanceChart data={attendance} />
          <AttendanceTable data={attendance} />
        </>
      )}
    </div>
  );
}
