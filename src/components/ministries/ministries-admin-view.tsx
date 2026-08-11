import Link from "next/link";
import { Users, ArrowRight, Clock } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ministries } from "@/lib/mock-data";

export function MinistriesAdminView() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Ministries"
        title="Teams and departments"
        description="Every ministry serving the house, with its own dashboard, members, schedule, and reports."
        actions={<Button variant="gold">Create ministry</Button>}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ministries.map((m) => (
          <Link key={m.id} href={`/ministries/${m.slug}`}>
            <Card className="group h-full transition-all hover:-translate-y-1 hover:shadow-soft-lg">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${m.color}1A`, color: m.color }}
                  >
                    <Users className="h-5 w-5" strokeWidth={1.75} />
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
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
                    <Clock className="h-3.5 w-3.5" /> {m.meetingSchedule}
                  </span>
                </div>
                {m.upcomingEvent && (
                  <Badge variant="gold" className="w-fit font-normal">
                    {m.upcomingEvent}
                  </Badge>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}