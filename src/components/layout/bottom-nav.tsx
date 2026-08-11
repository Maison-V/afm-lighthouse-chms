"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, CalendarDays, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNavContent } from "@/components/layout/mobile-nav";

const items = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Members", href: "/members", icon: Users },
  { label: "Events", href: "/events", icon: CalendarDays },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="glass-panel fixed inset-x-0 bottom-0 z-30 flex h-16 items-center justify-around border-t border-border lg:hidden">
      {items.map((item) => {
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-foreground transition-colors",
              active && "text-primary"
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={active ? 2 : 1.75} />
            {item.label}
          </Link>
        );
      })}
      <Sheet>
        <SheetTrigger asChild>
          <button className="flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-foreground">
            <MoreHorizontal className="h-5 w-5" strokeWidth={1.75} />
            More
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <MobileNavContent />
        </SheetContent>
      </Sheet>
    </nav>
  );
}
