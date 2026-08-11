import Link from "next/link";
import { UserPlus, CalendarPlus, FileText, ClipboardCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const actions = [
  { icon: UserPlus, label: "Register visitor", href: "/visitors" },
  { icon: CalendarPlus, label: "Create event", href: "/events" },
  { icon: ClipboardCheck, label: "Record attendance", href: "/attendance" },
  { icon: FileText, label: "Issue certificate", href: "/certificates" },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump straight into the most common tasks</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map(({ icon: Icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className="flex flex-col items-start gap-3 rounded-xl border border-border p-4 text-left transition-all hover:border-primary/30 hover:bg-accent/60 hover:shadow-soft"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-sm font-medium text-foreground">{label}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
