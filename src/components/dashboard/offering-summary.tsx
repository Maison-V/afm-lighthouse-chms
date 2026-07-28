"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { transactions } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/utils";

const income = transactions.filter((t) => t.type === "income");
const total = income.reduce((sum, t) => sum + t.amount, 0);

const byCategory = Object.entries(
  income.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] ?? 0) + t.amount;
    return acc;
  }, {})
)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5);

const colors = ["bg-primary", "bg-secondary", "bg-gold", "bg-success", "bg-info"];

export function OfferingSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Offering summary</CardTitle>
        <CardDescription>Giving breakdown this reporting period</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <p className="font-heading text-3xl font-semibold text-foreground">{formatCurrency(total)}</p>
        <div className="flex flex-col gap-3">
          {byCategory.map(([category, amount], i) => (
            <div key={category} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-foreground">{category}</span>
                <span className="text-muted-foreground">{formatCurrency(amount)}</span>
              </div>
              <Progress
                value={(amount / total) * 100}
                className="h-1.5"
                indicatorClassName={colors[i % colors.length]}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
