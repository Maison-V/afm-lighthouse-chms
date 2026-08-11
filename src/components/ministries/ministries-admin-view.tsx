import Link from "next/link";
import { Users, ArrowRight, Clock, Calendar } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { CreateMinistryDialog, EditMinistryDialog } from "@/components/ministries/ministry-dialogs";
import { getMinistries } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MinistriesAdminView() {
  const ministries = await getMinistries();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Ministries"
        title="Teams and departments"
        description={
          ministries.length === 0
            ? "No ministries yet — create the first team for the church."
            : "Every ministry serving the house, with its own schedule and details."
        }
        actions={<CreateMinistryDialog />}
      />

      {ministries.length === 0 ? (
        <EmptyState icon={Users} title="No ministries yet" description="Create a ministry and it will appear here — and on the public site." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <Card key={m.id} className="group flex flex-col">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${m.color}1A`, color: m.color }}
                  >
                    <Users className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <div className="flex items-center gap-1">
                    <EditMinistryDialog ministry={m} />
                    <Link href={`/ministries/${m.slug}`}>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </Link>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-subheading text-base font-semibold text-foreground">{m.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{m.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" /> {m.memberCount} members
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {m.meetingSchedule || "Schedule TBA"}
                  </span>
                </div>
                {m.upcomingEvent && (
                  <Badge variant="gold" className="w-fit gap-1 font-normal">
                    <Calendar className="h-3 w-3" /> {m.upcomingEvent}
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
