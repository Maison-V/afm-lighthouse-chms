"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, HeartHandshake, BadgeCheck } from "lucide-react";
import { ChurchLogo } from "@/components/shared/church-logo";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { cn } from "@/lib/utils";
import type { Profile } from "@/lib/types";

const links = [
  { label: "Home", href: "/", icon: Home },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Ministries", href: "/ministries", icon: HeartHandshake },
];

export function SiteHeader({
  profile,
  logoUrl,
}: {
  profile: Profile | null;
  logoUrl?: string | null;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-sidebar backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <div className="h-9 w-9">
            <ChurchLogo logoUrl={logoUrl} />
          </div>
          <div className="hidden sm:block">
            <p className="font-heading text-sm font-semibold leading-tight text-white">AFM Lighthouse</p>
            <p className="text-[11px] text-sidebar-foreground/60">Church · Vryburg</p>
          </div>
        </Link>

        <nav className="flex flex-1 items-center gap-1">
          {links.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-sidebar-foreground/70 transition-colors hover:bg-white/5 hover:text-white",
                  active && "bg-white/10 text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", active && "text-gold")} strokeWidth={1.75} />
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {profile ? (
            <>
              <span className="hidden items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-sidebar-foreground/80 md:flex">
                <BadgeCheck className="h-3.5 w-3.5 text-gold" />
                {profile.role === "admin" ? "Administrator" : "Member"}
                <span className="text-sidebar-foreground/50">· {profile.fullName}</span>
              </span>
              <SignOutButton className="text-sidebar-foreground/70 hover:text-white" />
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="text-white hover:bg-white/10 hover:text-white">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm" className="hidden sm:inline-flex">
                <Link href="/register">Join the church</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}