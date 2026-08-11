import { CalendarPlus, Clock, MapPin, QrCode, Users } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { EventDetailDialog } from "@/components/events/event-detail-dialog";
import { events } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const categoryTone: Record<string, "default" | "gold" | "success" | "info" | "secondary"> = {
  service: "default",
  conference: "gold",
  outreach: "success",
  training: "info",
  social: "secondary",
};

export function EventsAdminView() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Events"
        title="Calendar and check-in"
        description="Every service, conference, and gathering — with registration, QR check-in, and volunteer assignments in one place."
        actions={
          <Button variant="gold" className="gap-2">
            <CalendarPlus className="h-4 w-4" /> Create event
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventDetailDialog key={event.id} event={event}>
            <Card className="h-full cursor-pointer transition-all hover:-translate-y-1 hover:shadow-soft-lg">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <Badge variant={categoryTone[event.category]} className="capitalize">
                    {event.category}
                  </Badge>
                  {event.checkInEnabled && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <QrCode className="h-3.5 w-3.5" /> Check-in
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <p className="font-subheading text-base font-semibold text-foreground">{event.title}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{event.description}</p>
                </div>

                <div className="flex flex-col gap-1.5 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" /> {formatDate(event.date, { year: undefined })} · {event.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" /> {event.location}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Registered</span>
                    <span>{event.registered}/{event.capacity}</span>
                  </div>
                  <Progress value={(event.registered / event.capacity) * 100} className="h-1.5" />
                </div>
              </CardContent>
            </Card>
          </EventDetailDialog>
        ))}
      </div>
    </div>
  );
}