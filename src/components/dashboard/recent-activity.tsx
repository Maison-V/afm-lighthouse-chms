import { type LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function RecentActivity({
  items,
}: {
  items: { icon: LucideIcon; tone: string; text: string; time: string }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>The latest across every ministry and module</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative flex flex-col gap-5 border-l border-border pl-6">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <li key={i} className="relative">
                <span
                  className={cn(
                    "absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full ring-4 ring-card",
                    item.tone
                  )}
                >
                  <Icon className="h-3.5 w-3.5" strokeWidth={2} />
                </span>
                <p className="text-sm text-foreground">{item.text}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{item.time}</p>
              </li>
            );
          })}
        </ol>
      </CardContent>
    </Card>
  );
}
