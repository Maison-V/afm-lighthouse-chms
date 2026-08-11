"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronsLeft, LogOut } from "lucide-react";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { LighthouseMark } from "@/components/shared/lighthouse-mark";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function NavLink({
  item,
  collapsed,
  active,
}: {
  item: (typeof primaryNav)[number];
  collapsed: boolean;
  active: boolean;
}) {
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-white/5 hover:text-sidebar-foreground",
        active && "text-white",
        collapsed && "justify-center px-0"
      )}
    >
      {active && (
        <motion.span
          layoutId="sidebar-active-beam"
          className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full beam"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          active ? "bg-white/10 text-gold" : "text-sidebar-foreground/60 group-hover:text-gold"
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </span>
      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <TooltipProvider>
      <motion.aside
        animate={{ width: collapsed ? 84 : 272 }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className="glass sticky top-0 z-30 hidden h-svh shrink-0 flex-col border-r border-sidebar-border py-5 lg:flex"
      >
        <div className={cn("flex items-center gap-3 px-4", collapsed && "justify-center px-0")}>
          <div className="h-9 w-9 shrink-0">
            <LighthouseMark />
          </div>
          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden"
              >
                <p className="whitespace-nowrap font-heading text-sm font-semibold leading-tight text-white">
                  AFM Lighthouse
                </p>
                <p className="whitespace-nowrap text-[11px] text-sidebar-foreground/60">
                  Church Vryburg
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex flex-1 flex-col justify-between overflow-y-auto px-3">
          <nav className="flex flex-col gap-1">
            {primaryNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={pathname === item.href || pathname.startsWith(item.href + "/")}
              />
            ))}
          </nav>

          <div className="flex flex-col gap-1 border-t border-sidebar-border pt-3">
            {secondaryNav.map((item) => (
              <NavLink
                key={item.href}
                item={item}
                collapsed={collapsed}
                active={pathname === item.href || pathname.startsWith(item.href + "/")}
              />
            ))}
            <SignOutButton
              variant="ghost"
              className={cn(
                "justify-start text-sidebar-foreground/60 hover:bg-white/5 hover:text-destructive",
                collapsed && "justify-center px-0"
              )}
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              {!collapsed && "Log out"}
            </SignOutButton>
          </div>
        </div>

        <button
          onClick={() => setCollapsed((c) => !c)}
          className="mx-3 mt-4 flex h-9 items-center justify-center rounded-lg border border-sidebar-border text-sidebar-foreground/60 transition-colors hover:bg-white/5 hover:text-white"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <ChevronsLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </motion.aside>
    </TooltipProvider>
  );
}
