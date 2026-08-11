import { BarChart3, TrendingUp, Users, HeartHandshake, UserPlus } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { ExportAllButton } from "@/components/reports/export-all-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getMembers, getVisitors, getAttendance, getEvents, getMinistries, getCertificates } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {
  const [members, visitors, attendance, events, ministries, certificates] = await Promise.all([
    getMembers(),
    getVisitors(),
    getAttendance(),
    getEvents(),
    getMinistries(),
    getCertificates(),
  ]);

  const activeMembers = members.filter((m) => m.status === "active").length;
  const integratedVisitors = visitors.filter((v) => v.followUpStatus === "integrated").length;
  const visitorConversion =
    visitors.length > 0 ? Math.round((integratedVisitors / visitors.length) * 100) : 0;
  const avgAttendance =
    attendance.length > 0 ? Math.round(attendance.reduce((s, a) => s + a.total, 0) / attendance.length) : 0;
  const volunteers = members.filter((m) => m.volunteerStatus !== "none").length;

  const reports = [
    {
      title: "Membership growth",
      description: "The congregation register — total, active, and new members.",
      icon: Users,
      tone: "bg-primary/10 text-primary",
      stat: `${members.length} total`,
      detail: `${activeMembers} active · ${members.filter((m) => m.status === "new").length} new`,
    },
    {
      title: "Attendance trends",
      description: "Service attendance across every recorded gathering.",
      icon: TrendingUp,
      tone: "bg-info/10 text-info",
      stat: avgAttendance > 0 ? `${avgAttendance} avg` : "No data yet",
      detail: `${attendance.length} services recorded`,
    },
    {
      title: "Ministry health",
      description: "Teams and the people serving in them.",
      icon: HeartHandshake,
      tone: "bg-gold/15 text-gold",
      stat: `${ministries.length} ministries`,
      detail: `${volunteers} serving members`,
    },
    {
      title: "Visitor conversion",
      description: "The journey from first visit to full integration.",
      icon: UserPlus,
      tone: "bg-secondary/10 text-secondary",
      stat: visitors.length > 0 ? `${visitorConversion}% integrated` : "No data yet",
      detail: `${integratedVisitors} of ${visitors.length} visitors integrated`,
    },
    {
      title: "Church calendar",
      description: "Upcoming gatherings with live registrations.",
      icon: BarChart3,
      tone: "bg-muted text-muted-foreground",
      stat: `${events.length} events`,
      detail: `${events.reduce((s, e) => s + e.registered, 0)} registrations total`,
    },
    {
      title: "Certificates issued",
      description: "Baptism, membership, and other certificates generated.",
      icon: BarChart3,
      tone: "bg-muted text-muted-foreground",
      stat: `${certificates.length} issued`,
      detail: "Printable PDFs on record",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Reports"
        title="Insights across the house"
        description="Understand growth, attendance, and ministry health at a glance."
        actions={
          <ExportAllButton
            members={members}
            visitors={visitors}
            attendance={attendance}
            events={events}
            ministries={ministries}
            certificates={certificates}
          />
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.title} className="transition-all hover:-translate-y-1 hover:shadow-soft-lg">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.tone}`}>
                  <r.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <Badge variant="muted" className="font-semibold">
                  {r.stat}
                </Badge>
              </div>
              <div>
                <p className="font-subheading text-base font-semibold text-foreground">{r.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
                <p className="mt-1 text-xs font-medium text-foreground/70">{r.detail}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
