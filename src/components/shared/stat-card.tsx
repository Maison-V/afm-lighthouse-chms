"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  tone?: "primary" | "gold" | "success" | "info";
  index?: number;
}

const toneStyles: Record<NonNullable<StatCardProps["tone"]>, string> = {
  primary: "bg-primary/10 text-primary",
  gold: "bg-gold/15 text-gold",
  success: "bg-success/10 text-success",
  info: "bg-info/10 text-info",
};

// Note: `icon` is passed as an already-created element (e.g. `<Users />`)
// rather than a bare component reference — Server Components can't pass raw
// function references as props into a Client Component boundary, but a
// resolved element is serializable across that boundary.
export function StatCard({ label, value, icon, trend, tone = "primary", index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06, ease: "easeOut" }}
      whileHover={{ y: -3 }}
    >
      <Card className="flex flex-col gap-4 p-5 transition-shadow hover:shadow-soft-lg">
        <div className="flex items-start justify-between">
          <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl [&_svg]:h-5 [&_svg]:w-5", toneStyles[tone])}>
            {icon}
          </div>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium",
                trend.direction === "up" && "text-success",
                trend.direction === "down" && "text-destructive",
                trend.direction === "flat" && "text-muted-foreground"
              )}
            >
              {trend.value}
            </span>
          )}
        </div>
        <div>
          <p className="font-heading text-2xl font-semibold text-foreground">{value}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{label}</p>
        </div>
      </Card>
    </motion.div>
  );
}
