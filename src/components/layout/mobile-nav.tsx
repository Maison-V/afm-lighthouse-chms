"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { ChurchLogo } from "@/components/shared/church-logo";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";

export function MobileNavContent({ logoUrl }: { logoUrl?: string | null }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar py-5 text-sidebar-foreground">
      <div className="flex items-center gap-3 px-5">
        <div className="h-9 w-9 shrink-0">
          <ChurchLogo logoUrl={logoUrl} />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold leading-tight text-white">AFM Lighthouse</p>
          <p className="text-[11px] text-sidebar-foreground/60">Church Vryburg</p>
        </div>
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1 overflow-y-auto px-3">
        {primaryNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-white/5 hover:text-white",
                active && "bg-white/10 text-white"
              )}
            >
              <Icon className={cn("h-[18px] w-[18px]", active && "text-gold")} strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-sidebar-border px-3 pt-3">
        {secondaryNav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-white/5 hover:text-white",
                active && "bg-white/10 text-white"
              )}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
        <SignOutButton
          variant="ghost"
          className="justify-start text-sidebar-foreground/60 hover:bg-white/5 hover:text-destructive"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.75} />
          Log out
        </SignOutButton>
      </div>
    </div>
  );
}
