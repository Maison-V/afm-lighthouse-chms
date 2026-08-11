import { Users, Clock, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { getMinistries } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function MinistriesPublicView() {
  const ministries = await getMinistries();

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <p className="font-subheading text-sm font-semibold uppercase tracking-wider text-primary">
          Ministries
        </p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Teams and departments</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every ministry serving the house — find your place to serve and grow.
        </p>
      </div>

      {ministries.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            icon={Users}
            title="Ministries are being launched"
            description="Check back soon to see the teams serving at AFM Lighthouse."
          />
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.map((m) => (
            <Card key={m.id} className="transition-all hover:-translate-y-1 hover:shadow-soft-lg">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${m.color}1A`, color: m.color }}
                >
                  <Users className="h-5 w-5" strokeWidth={1.75} />
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
