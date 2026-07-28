import { UserPlus, HandCoins, CalendarCheck, Award, HeartHandshake } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const activity = [
  {
    icon: UserPlus,
    tone: "text-info bg-info/10",
    text: "Naledi Mokoena registered a new visitor, Amogelang Botha",
    time: "2 hours ago",
  },
  {
    icon: HandCoins,
    tone: "text-success bg-success/10",
    text: "Tithe and offering recorded for Sunday Morning Service",
    time: "1 day ago",
  },
  {
    icon: Award,
    tone: "text-gold bg-gold/15",
    text: "Baptism certificate issued to Katlego Ndlovu",
    time: "2 days ago",
  },
  {
    icon: CalendarCheck,
    tone: "text-primary bg-primary/10",
    text: "142 members checked in for the Women's Conference",
    time: "3 days ago",
  },
  {
    icon: HeartHandshake,
    tone: "text-destructive bg-destructive/10",
    text: "New prayer request submitted via the Youth Ministry",
    time: "4 days ago",
  },
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>The latest across every ministry and module</CardDescription>
      </CardHeader>
      <CardContent>
        <ol className="relative flex flex-col gap-5 border-l border-border pl-6">
          {activity.map((item, i) => {
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
