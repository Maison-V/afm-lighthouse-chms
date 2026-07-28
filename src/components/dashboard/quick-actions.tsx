import { UserPlus, CalendarPlus, HandCoins, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const actions = [
  { icon: UserPlus, label: "Register visitor" },
  { icon: CalendarPlus, label: "Create event" },
  { icon: HandCoins, label: "Record gift" },
  { icon: FileText, label: "Issue certificate" },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump straight into the most common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex flex-col items-start gap-3 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/30 hover:bg-accent/60 hover:shadow-soft"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
