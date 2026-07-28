import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from "@/lib/utils";

const budgets = [
  { name: "Building Fund", spent: 84000, budget: 120000 },
  { name: "Outreach & Welfare", spent: 31500, budget: 40000 },
  { name: "Media Equipment", spent: 18200, budget: 25000 },
  { name: "Youth Ministry", spent: 9800, budget: 15000 },
];

export function BudgetsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Budgets</CardTitle>
        <CardDescription>Spend against this year&apos;s approved budgets</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {budgets.map((b) => {
          const pct = Math.round((b.spent / b.budget) * 100);
          return (
            <div key={b.name} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{b.name}</span>
                <span className="text-muted-foreground">
                  {formatCurrency(b.spent)} / {formatCurrency(b.budget)}
                </span>
              </div>
              <Progress
                value={pct}
                className="h-1.5"
                indicatorClassName={pct > 90 ? "bg-destructive" : pct > 70 ? "bg-warning" : "bg-success"}
              />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
