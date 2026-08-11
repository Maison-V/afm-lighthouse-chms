import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import type { ChurchEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";

const categoryTone: Record<string, "default" | "gold" | "success" | "info" | "secondary"> = {
  service: "default",
  conference: "gold",
  outreach: "success",
  training: "info",
  social: "secondary",
};

export function UpcomingEvents({ events }: { events: ChurchEvent[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming events</CardTitle>
        <CardDescription>What&apos;s next on the church calendar</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {events.length === 0 ? (
          <EmptyState
            icon={CalendarDays}
            title="Nothing scheduled yet"
            description="Create an event and it will show up here."
          />
        ) : (
          events.map((event) => (
            <Link
              key={event.id}
              href="/events"
              className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-accent/60"
            >
              <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="h-4 w-4" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">{event.title}</p>
                  <Badge variant={categoryTone[event.category]} className="shrink-0 capitalize">
                    {event.category}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {formatDate(event.date, { month: "short", day: "numeric", year: undefined })} · {event.time}
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {event.location}
                </p>
              </div>
            </Link>
          ))
        )}
      </CardContent>
    </Card>
  );
}
