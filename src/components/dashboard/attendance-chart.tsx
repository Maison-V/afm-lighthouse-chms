"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { attendance } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

const data = attendance.map((a) => ({
  date: formatDate(a.date, { month: "short", day: "numeric", year: undefined }),
  Total: a.total,
  Visitors: a.visitors,
}));

export function AttendanceChart() {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Attendance trend</CardTitle>
        <CardDescription>Total service attendance over the last {attendance.length} gatherings</CardDescription>
      </CardHeader>
      <CardContent className="h-72 pl-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 16, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id="totalFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#123E73" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#123E73" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="visitorsFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#C9A227" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#C9A227" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 8" vertical={false} stroke="hsl(220 13% 91%)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "hsl(220 9% 46%)", fontSize: 12 }}
            />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "hsl(220 9% 46%)", fontSize: 12 }} width={36} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid hsl(220 13% 91%)",
                fontSize: 13,
                fontFamily: "var(--font-inter)",
              }}
            />
            <Area type="monotone" dataKey="Total" stroke="#123E73" strokeWidth={2.5} fill="url(#totalFill)" />
            <Area type="monotone" dataKey="Visitors" stroke="#C9A227" strokeWidth={2} fill="url(#visitorsFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
