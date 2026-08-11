import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, TrendingUp, CalendarDays } from "lucide-react";
import { getMinistryBySlug, getMembers } from "@/lib/data";
import { initials } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/shared/stat-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";

export const dynamic = "force-dynamic";

export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ministry = await getMinistryBySlug(slug);
  if (!ministry) notFound();

  const members = await getMembers();
  const ministryMembers = members.filter((m) => m.ministries.includes(ministry.name)).slice(0, 10);
  const attendanceRate =
    ministryMembers.length === 0
      ? 0
      : Math.round(ministryMembers.reduce((sum, m) => sum + m.attendanceRate, 0) / ministryMembers.length);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/ministries" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to ministries
      </Link>

      <div className="flex flex-col gap-2">
        <span className="font-subheading text-xs font-semibold uppercase tracking-[0.14em] text-secondary">Ministry</span>
        <h1 className="font-heading text-2xl font-semibold text-foreground sm:text-3xl">{ministry.name}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">{ministry.description}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Members" value={ministry.memberCount} icon={<Users />} tone="primary" index={0} />
        <StatCard label="Leader" value={ministry.leader ? ministry.leader.replace(/^(Sis\.|Bro\.|Pastor|Elder|Min\.)\s/, "") : "TBA"} icon={<TrendingUp />} tone="gold" index={1} />
        <StatCard label="Meets" value={ministry.meetingSchedule || "TBA"} icon={<Clock />} tone="info" index={2} />
        <StatCard label="Avg attendance" value={attendanceRate > 0 ? `${attendanceRate}%` : "—"} icon={<TrendingUp />} tone="success" index={3} />
      </div>

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="members">Members</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <Card>
            <CardHeader>
              <CardTitle>Ministry overview</CardTitle>
              <CardDescription>Led by {ministry.leader}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground">
              <p>
                {ministry.name} meets {ministry.meetingSchedule.toLowerCase()} and currently serves {ministry.memberCount} active
                members. {ministry.upcomingEvent ?? "No upcoming ministry-specific events are scheduled."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Ministry members</CardTitle>
              <CardDescription>{ministryMembers.length} shown from the congregation register</CardDescription>
            </CardHeader>
            <CardContent>
              {ministryMembers.length === 0 ? (
                <EmptyState icon={Users} title="No members yet" description="Assign members to this ministry from their profile." />
              ) : (
                <ul className="flex flex-col gap-3">
                  {ministryMembers.map((m) => (
                    <li key={m.id} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback>{initials(`${m.firstName} ${m.lastName}`)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {m.firstName} {m.lastName}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                      </div>
                      <Badge variant={m.volunteerStatus === "leader" ? "gold" : "outline"} className="capitalize">
                        {m.volunteerStatus === "none" ? "Member" : m.volunteerStatus}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Meeting schedule</CardTitle>
              <CardDescription>Recurring gatherings for this ministry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 rounded-xl bg-muted/50 p-4">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">{ministry.meetingSchedule}</p>
                  <p className="text-xs text-muted-foreground">Main Auditorium, unless otherwise announced</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Ministry-level insights</CardDescription>
            </CardHeader>
            <CardContent>
              <EmptyState
                icon={TrendingUp}
                title="Reports coming soon"
                description="Attendance and growth reports for this ministry will appear here once enough data has been collected."
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
