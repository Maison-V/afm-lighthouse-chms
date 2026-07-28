"use client";

import * as React from "react";
import { QrCode, MapPin, Users, Clock } from "lucide-react";
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

const categoryTone: Record<string, "default" | "gold" | "success" | "info" | "secondary"> = {
  service: "default",
  conference: "gold",
  outreach: "success",
  training: "info",
  social: "secondary",
};

export function EventDetailDialog({ event, children }: { event: ChurchEvent; children: React.ReactNode }) {
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
          <Progress value={(event.registered / event.capacity) * 100} className="h-2" />
        </div>

        {event.checkInEnabled && (
          <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
            <div className="flex items-center gap-2.5">
              <QrCode className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-foreground">QR check-in enabled</p>
                <p className="text-xs text-muted-foreground">Guests can scan to check in on arrival</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View code
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">
            Assign volunteers
          </Button>
          <Button className="flex-1">Manage registration</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
