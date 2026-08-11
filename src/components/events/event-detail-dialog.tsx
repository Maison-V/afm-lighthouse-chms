"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapPin, Users, Clock, Trash2, Mail, Phone } from "lucide-react";
import type { ChurchEvent } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { deleteEvent, deleteEventRegistration } from "@/lib/actions";

const categoryTone: Record<string, "default" | "gold" | "success" | "info" | "secondary"> = {
  service: "default",
  conference: "gold",
  outreach: "success",
  training: "info",
  social: "secondary",
};

export interface EventRegistration {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  created_at: string;
}

export function EventDetailDialog({
  event,
  registrations,
  children,
}: {
  event: ChurchEvent;
  registrations: EventRegistration[];
  children: React.ReactNode;
}) {
  const router = useRouter();

  async function removeEvent() {
    if (!confirm(`Delete "${event.title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(event.id);
      toast.success("Event deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function removeRegistration(id: string, name: string) {
    try {
      await deleteEventRegistration(id);
      toast.success(`${name} was removed from registrations`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  const pct = Math.min(100, (event.registered / event.capacity) * 100);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <Badge variant={categoryTone[event.category]} className="w-fit capitalize">
            {event.category}
          </Badge>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>{event.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="text-foreground">
              {formatDate(event.date)} · {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-foreground">{event.location}</span>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Users className="h-4 w-4" /> Registration
            </span>
            <span className="font-medium text-foreground">
              {event.registered} / {event.capacity}
            </span>
          </div>
          <Progress value={pct} className="h-2" />
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-foreground">Registrations</p>
          {registrations.length === 0 ? (
            <p className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
              No one has registered yet. Share the event page so people can sign up.
            </p>
          ) : (
            <ul className="flex max-h-48 flex-col gap-2 overflow-y-auto pr-1">
              {registrations.map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2 rounded-lg bg-muted/50 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{r.name}</p>
                    <p className="flex flex-wrap items-center gap-x-3 text-xs text-muted-foreground">
                      {r.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="h-3 w-3" /> {r.email}
                        </span>
                      )}
                      {r.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" /> {r.phone}
                        </span>
                      )}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => removeRegistration(r.id, r.name)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1 text-destructive hover:text-destructive" onClick={removeEvent}>
            <Trash2 className="h-4 w-4" /> Delete event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
