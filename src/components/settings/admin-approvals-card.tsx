"use client";

import { useState, useTransition } from "react";
import { Check, X, Clock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { approveAdmin, rejectAdmin } from "@/app/(app)/settings/actions";
import type { Profile } from "@/lib/types";

interface PendingApprovalsCardProps {
  /** Pending admin requests (real profiles when Supabase is configured, demo data otherwise). */
  pending: Profile[];
  /** When false, actions are demo-only (no Supabase project connected yet). */
  live: boolean;
}

export function AdminApprovalsCard({ pending, live }: PendingApprovalsCardProps) {
  const [items, setItems] = useState(pending);
  const [isPending, startTransition] = useTransition();

  function resolve(id: string, status: "approved" | "rejected") {
    startTransition(async () => {
      if (live) {
        try {
          if (status === "approved") await approveAdmin(id);
          else await rejectAdmin(id);
        } catch (error) {
          toast.error(error instanceof Error ? error.message : "Could not update this request.");
          return;
        }
      }
      setItems((prev) => prev.filter((p) => p.id !== id));
      toast.success(status === "approved" ? "Admin approved." : "Request rejected.");
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin approvals</CardTitle>
        <CardDescription>
          People who registered as admins are locked out until an administrator approves them here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            icon={ShieldCheck}
            title="No pending approvals"
            description={live ? "New admin registrations will appear here." : "Pending admin requests will appear here once Supabase is connected."}
          />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {items.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
                <div className="flex min-w-0 items-center gap-3">
                  <Avatar className="h-9 w-9 text-xs">
                    <AvatarFallback>
                      {p.fullName
                        .split(" ")
                        .slice(-2)
                        .map((n) => n[0])
                        .join("") || "A"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{p.fullName || "Unnamed admin"}</p>
                    <p className="truncate text-xs text-muted-foreground">{p.email ?? p.id}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Badge variant="outline" className="gap-1">
                    <Clock className="h-3 w-3" /> Pending
                  </Badge>
                  <Button size="sm" variant="outline" disabled={isPending} onClick={() => resolve(p.id, "rejected")}>
                    <X className="h-3.5 w-3.5" /> Reject
                  </Button>
                  <Button size="sm" variant="gold" disabled={isPending} onClick={() => resolve(p.id, "approved")}>
                    <Check className="h-3.5 w-3.5" /> Approve
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}