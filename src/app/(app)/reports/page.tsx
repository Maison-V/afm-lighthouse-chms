import { BarChart3, TrendingUp, Users, Wallet, HeartHandshake, UserPlus, Download } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const reports = [
  {
    title: "Membership growth",
    description: "New members, transfers, and attrition over time.",
    icon: Users,
    tone: "bg-primary/10 text-primary",
    change: "+8.2%",
    direction: "up" as const,
  },
  {
    title: "Giving trends",
    description: "Tithes, offerings, and special donations by month.",
    icon: Wallet,
    tone: "bg-success/10 text-success",
    change: "+12.4%",
    direction: "up" as const,
  },
  {
    title: "Attendance trends",
    description: "Service attendance across morning and midweek gatherings.",
    icon: TrendingUp,
    tone: "bg-info/10 text-info",
    change: "+3.1%",
    direction: "up" as const,
  },
  {
    title: "Ministry health",
    description: "Active volunteers and engagement across every ministry.",
    icon: HeartHandshake,
    tone: "bg-gold/15 text-gold",
    change: "-1.4%",
    direction: "down" as const,
  },
  {
    title: "Visitor conversion",
    description: "The journey from first visit to full integration.",
    icon: UserPlus,
    tone: "bg-secondary/10 text-secondary",
    change: "+5.6%",
    direction: "up" as const,
  },
  {
    title: "Custom report",
    description: "Build a report from any combination of modules.",
    icon: BarChart3,
    tone: "bg-muted text-muted-foreground",
    change: null,
    direction: "flat" as const,
  },
];

export default function ReportsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Reports"
        title="Insights across the house"
        description="Understand growth, giving, attendance, and ministry health at a glance."
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export all
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {reports.map((r) => (
          <Card key={r.title} className="group cursor-pointer transition-all hover:-translate-y-1 hover:shadow-soft-lg">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${r.tone}`}>
                  <r.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                {r.change && (
                  <Badge variant={r.direction === "up" ? "success" : "destructive"}>{r.change}</Badge>
                )}
              </div>
              <div>
                <p className="font-subheading text-base font-semibold text-foreground">{r.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{r.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
