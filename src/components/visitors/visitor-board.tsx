"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Phone, Mail, Search, UserRoundCheck, MoreHorizontal } from "lucide-react";
import type { Visitor, FollowUpStatus } from "@/lib/types";
import { cn, formatDate, initials } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";
import { updateVisitorStatus, incrementVisitorVisits } from "@/lib/actions";

const columns: { status: FollowUpStatus; label: string; tone: string }[] = [
  { status: "new", label: "New", tone: "border-t-info" },
  { status: "contacted", label: "Contacted", tone: "border-t-gold" },
  { status: "visited", label: "Visited Again", tone: "border-t-secondary" },
  { status: "integrated", label: "Integrated", tone: "border-t-success" },
  { status: "lost", label: "Lost Contact", tone: "border-t-destructive" },
];

const statusOptions: FollowUpStatus[] = ["new", "contacted", "visited", "integrated", "lost"];

function VisitorCard({ visitor }: { visitor: Visitor }) {
  const router = useRouter();

  async function setStatus(status: FollowUpStatus) {
    try {
      await updateVisitorStatus(visitor.id, status);
      toast.success(`Moved to ${status}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function markVisited() {
    try {
      await incrementVisitorVisits(visitor.id);
      toast.success("Visit counted — moved to Visited Again");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Card className="p-3 transition-shadow hover:shadow-soft-lg">
      <CardContent className="flex flex-col gap-2 p-0">
        <div className="flex items-center gap-2.5">
          <Avatar className="h-8 w-8 text-xs">
            <AvatarFallback>{initials(visitor.name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">{visitor.name}</p>
            <p className="truncate text-xs text-muted-foreground">{visitor.source}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {statusOptions.map((s) => (
                <DropdownMenuItem key={s} className="capitalize" onClick={() => setStatus(s)}>
                  Move to {s}
                </DropdownMenuItem>
              ))}
              <DropdownMenuItem onClick={markVisited}>Count a visit</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <UserRoundCheck className="h-3 w-3" /> {visitor.assignedTo || "Unassigned"}
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatDate(visitor.firstVisit, { year: undefined })}</span>
          <span>{visitor.visits} visit{visitor.visits > 1 ? "s" : ""}</span>
        </div>
        {visitor.prayerRequest && (
          <p className="line-clamp-2 rounded-lg bg-muted/50 p-2 text-xs italic text-muted-foreground">
            “{visitor.prayerRequest}”
          </p>
        )}
        <div className="mt-1 flex gap-1.5 border-t border-border pt-2">
          <a
            href={visitor.phone ? `tel:${visitor.phone.replace(/\s+/g, "")}` : undefined}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-xs text-muted-foreground",
              visitor.phone ? "hover:bg-accent hover:text-foreground" : "pointer-events-none opacity-40"
            )}
          >
            <Phone className="h-3 w-3" /> Call
          </a>
          <a
            href={visitor.email ? `mailto:${visitor.email}` : undefined}
            className={cn(
              "flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-xs text-muted-foreground",
              visitor.email ? "hover:bg-accent hover:text-foreground" : "pointer-events-none opacity-40"
            )}
          >
            <Mail className="h-3 w-3" /> Email
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

export function VisitorBoard({ data }: { data: Visitor[] }) {
  const [search, setSearch] = React.useState("");

  const filtered = data.filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search visitors…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="grid grid-cols-1 gap-4 overflow-x-auto sm:grid-cols-2 lg:grid-cols-5">
        {columns.map((col) => {
          const items = filtered.filter((v) => v.followUpStatus === col.status);
          return (
            <div key={col.status} className="flex min-w-0 flex-col gap-3">
              <div className="flex items-center justify-between px-1">
                <p className="text-sm font-semibold text-foreground">{col.label}</p>
                <Badge variant="muted">{items.length}</Badge>
              </div>
              <div className={cn("flex flex-col gap-3 rounded-card border-t-2 bg-muted/30 p-2", col.tone)}>
                {items.length === 0 ? (
                  <p className="px-2 py-6 text-center text-xs text-muted-foreground">No visitors here</p>
                ) : (
                  items.map((v) => <VisitorCard key={v.id} visitor={v} />)
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <EmptyState icon={Search} title="No visitors found" description="Try a different search term." />
      )}
    </div>
  );
}
