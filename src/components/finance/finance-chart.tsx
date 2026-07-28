"use client";

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { transactions } from "@/lib/mock-data";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const byMonth = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, t) => {
  const month = Number(t.date.split("-")[1]) - 1;
  const key = monthNames[month];
  acc[key] = acc[key] ?? { income: 0, expense: 0 };
  acc[key][t.type] += t.amount;
  return acc;
}, {});

const data = monthNames
  .filter((m) => byMonth[m])
  .map((m) => ({ month: m, Income: byMonth[m].income, Expenses: byMonth[m].expense }));

export function FinanceChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Income vs. expenses</CardTitle>
        <CardDescription>Monthly totals across all giving and spending categories</CardDescription>
      </CardHeader>
      <CardContent className="h-72 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 16, left: -12, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="hsl(220 13% 91%)" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: "hsl(220 9% 46%)", fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(220 9% 46%)", fontSize: 12 }} width={36} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid hsl(220 13% 91%)", fontSize: 13, fontFamily: "var(--font-inter)" }}
            />
            <Legend wrapperStyle={{ fontSize: 13 }} />
            <Bar dataKey="Income" fill="#123E73" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="Expenses" fill="#C9A227" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
