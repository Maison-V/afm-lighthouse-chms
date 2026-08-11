import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { HeartHandshake } from "lucide-react";
import type { Visitor } from "@/lib/types";

export function PrayerRequests({ visitors }: { visitors: Visitor[] }) {
  const requests = visitors.filter((v) => v.prayerRequest).slice(0, 3);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <div>
          <CardTitle>Prayer requests</CardTitle>
          <CardDescription>Recent requests from visitors and members</CardDescription>
        </div>
        <Badge variant="gold">{requests.length} open</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {requests.length === 0 ? (
          <EmptyState
            icon={HeartHandshake}
            title="No prayer requests"
            description="Requests captured from visitors will appear here."
          />
        ) : (
          requests.map((r) => (
            <div key={r.id} className="rounded-xl bg-muted/50 p-4">
              <p className="font-scripture text-sm italic leading-relaxed text-foreground">&ldquo;{r.prayerRequest}&rdquo;</p>
              <p className="mt-2 text-xs text-muted-foreground">— {r.name}</p>
            </div>
          ))
        )}
        <blockquote className="border-l-2 border-gold pl-4 font-scripture text-sm italic leading-relaxed text-muted-foreground">
          &ldquo;Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.&rdquo;
          <footer className="mt-1 not-italic text-xs">Philippians 4:6, KJV</footer>
        </blockquote>
      </CardContent>
    </Card>
  );
}
