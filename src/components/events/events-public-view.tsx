import { Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { events } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const categoryTone: Record<string, "default" | "gold" | "success" | "info" | "secondary"> = {
  service: "default",
  conference: "gold",
  outreach: "success",
  training: "info",
  social: "secondary",
};

export function EventsPublicView() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-2">
        <p className="font-subheading text-sm font-semibold uppercase tracking-wider text-primary">
          Events
        </p>
        <h1 className="font-heading text-3xl font-semibold text-foreground">Gather with us</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Every service, conference, and gathering at AFM Lighthouse — everyone is welcome.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...events]
          .sort((a, b) => a.date.localeCompare(b.date))
          .map((event) => (
            <Card key={event.id} className="transition-all hover:-translate-y-1 hover:shadow-soft-lg">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <Badge variant={categoryTone[event.category]} className="capitalize">
                    {event.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(event.date, { year: undefined })}
                  </span>
                </div>

                <div className="flex-1">
                  <p className="font-subheading text-base font-semibold text-foreground">{event.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                </div>

                <div className="flex flex-col gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {event.location}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>
    </div>
  );
}