import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
  ShieldCheck,
  FileText,
  StickyNote,
  Users as UsersIcon,
} from "lucide-react";
import { members } from "@/lib/mock-data";
import { cn, formatDate, initials } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/empty-state";

const statusTone: Record<string, "success" | "muted" | "gold" | "info"> = {
  active: "success",
  inactive: "muted",
  new: "gold",
  transferred: "info",
};

export function generateStaticParams() {
  return members.map((m) => ({ id: m.id }));
}

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = members.find((m) => m.id === id);
  if (!member) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Link href="/members" className="flex w-fit items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to members
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
        {/* Profile card */}
        <Card className="h-fit">
          <CardContent className="flex flex-col items-center gap-4 pt-6 text-center">
            <Avatar className="h-24 w-24 text-2xl">
              <AvatarFallback>{initials(`${member.firstName} ${member.lastName}`)}</AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">
                {member.firstName} {member.lastName}
              </h2>
              <Badge variant={statusTone[member.status]} className="mt-2 capitalize">
                {member.status}
              </Badge>
            </div>

            <Separator />

            <div className="flex w-full flex-col gap-3 text-left text-sm">
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Mail className="h-4 w-4 shrink-0" />
                <span className="truncate text-foreground">{member.email}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <Phone className="h-4 w-4 shrink-0" />
                <span className="text-foreground">{member.phone}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <MapPin className="h-4 w-4 shrink-0" />
                <span className="text-foreground">{member.address}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <CalendarDays className="h-4 w-4 shrink-0" />
                <span className="text-foreground">Joined {formatDate(member.joinedAt)}</span>
              </div>
              <div className="flex items-center gap-2.5 text-muted-foreground">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span className="capitalize text-foreground">{member.volunteerStatus === "none" ? "Not currently serving" : member.volunteerStatus}</span>
              </div>
            </div>

            <Separator />

            <div className="flex w-full flex-wrap gap-1.5">
              {member.ministries.map((m) => (
                <Badge key={m} variant="outline" className="font-normal">
                  {m}
                </Badge>
              ))}
            </div>

            <div className="flex w-full gap-2">
              <Button variant="outline" className="flex-1">
                Edit profile
              </Button>
              <Button className="flex-1">Message</Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div>
          <Tabs defaultValue="overview">
            <TabsList className="flex-wrap">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                  <CardDescription>A history of this member&apos;s journey with the church</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="relative flex flex-col gap-6 border-l border-border pl-6">
                    {member.timeline.map((event) => (
                      <li key={event.id} className="relative">
                        <span className="absolute -left-[27px] h-3 w-3 rounded-full border-2 border-card bg-primary" />
                        <p className="text-xs font-medium uppercase tracking-wide text-secondary">{formatDate(event.date)}</p>
                        <p className="mt-1 text-sm font-medium text-foreground">{event.label}</p>
                        <p className="mt-0.5 text-sm text-muted-foreground">{event.description}</p>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="family">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Family</CardTitle>
                    <CardDescription>Spouse and immediate household</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {member.family.length === 0 ? (
                      <EmptyState icon={UsersIcon} title="No family linked" description="Add a spouse or household member to this profile." />
                    ) : (
                      <ul className="flex flex-col gap-3">
                        {member.family.map((f, i) => (
                          <li key={i} className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarFallback>{initials(f.name)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{f.name}</p>
                              <p className="text-xs text-muted-foreground">{f.relation}</p>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Children</CardTitle>
                    <CardDescription>Registered in Children&apos;s Church</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {member.children.length === 0 ? (
                      <EmptyState icon={UsersIcon} title="No children on record" description="Add children to enrol them in Children's Church." />
                    ) : (
                      <ul className="flex flex-col gap-3">
                        {member.children.map((c, i) => (
                          <li key={i} className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
                            <span className="text-sm font-medium text-foreground">{c.name}</span>
                            <span className="text-xs text-muted-foreground">{c.age} years old</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="attendance">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance rate</CardTitle>
                  <CardDescription>Based on the last 12 months of services</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading text-3xl font-semibold text-foreground">{member.attendanceRate}%</span>
                    <Badge variant={member.attendanceRate > 70 ? "success" : member.attendanceRate > 40 ? "warning" : "destructive"}>
                      {member.attendanceRate > 70 ? "Consistent" : member.attendanceRate > 40 ? "Occasional" : "Needs follow-up"}
                    </Badge>
                  </div>
                  <Progress value={member.attendanceRate} className="h-2" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>Certificates and files on record</CardDescription>
                </CardHeader>
                <CardContent>
                  {member.documents.length === 0 ? (
                    <EmptyState icon={FileText} title="No documents yet" description="Certificates issued to this member will appear here." />
                  ) : (
                    <ul className="flex flex-col gap-2">
                      {member.documents.map((d) => (
                        <li key={d.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
                          <div className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-primary" />
                            <div>
                              <p className="text-sm font-medium text-foreground">{d.name}</p>
                              <p className="text-xs text-muted-foreground">{d.type} · {formatDate(d.date)}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">Download</Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes">
              <Card>
                <CardHeader>
                  <CardTitle>Pastoral notes</CardTitle>
                  <CardDescription>Private notes visible to leadership only</CardDescription>
                </CardHeader>
                <CardContent>
                  {member.notes.length === 0 ? (
                    <EmptyState icon={StickyNote} title="No notes yet" description="Notes from pastoral visits or conversations will appear here." />
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {member.notes.map((n) => (
                        <li key={n.id} className={cn("rounded-xl bg-muted/50 p-4")}>
                          <p className="text-sm text-foreground">{n.content}</p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {n.author} · {formatDate(n.date)}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
