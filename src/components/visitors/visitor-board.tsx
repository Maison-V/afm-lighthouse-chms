"use client";

import * as React from "react";
import { Phone, Mail, Search, UserRoundCheck } from "lucide-react";
import type { Visitor, FollowUpStatus } from "@/lib/types";
import { cn, formatDate, initials } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";

const columns: { status: FollowUpStatus; label: string; tone: string }[] = [
  { status: "new", label: "New", tone: "border-t-info" },
  { status: "contacted", label: "Contacted", tone: "border-t-gold" },
  { status: "visited", label: "Visited Again", tone: "border-t-secondary" },
  { status: "integrated", label: "Integrated", tone: "border-t-success" },
  { status: "lost", label: "Lost Contact", tone: "border-t-destructive" },
];

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
                  items.map((v) => (
                    <Card key={v.id} className="cursor-pointer p-3 transition-shadow hover:shadow-soft-lg">
                      <CardContent className="flex flex-col gap-2 p-0">
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 text-xs">
                            <AvatarFallback>{initials(v.name)}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">{v.name}</p>
                            <p className="truncate text-xs text-muted-foreground">{v.source}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <UserRoundCheck className="h-3 w-3" /> {v.assignedTo}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{formatDate(v.firstVisit, { year: undefined })}</span>
                          <span>{v.visits} visit{v.visits > 1 ? "s" : ""}</span>
                        </div>
                        <div className="mt-1 flex gap-1.5 border-t border-border pt-2">
                          <button className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                            <Phone className="h-3 w-3" /> Call
                          </button>
                          <button className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1 text-xs text-muted-foreground hover:bg-accent hover:text-foreground">
                            <Mail className="h-3 w-3" /> Email
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
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
