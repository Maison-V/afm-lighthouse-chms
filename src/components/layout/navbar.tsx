"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Moon, Search, Sun, User, Settings as SettingsIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { primaryNav, secondaryNav } from "@/lib/nav";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MobileNavContent } from "@/components/layout/mobile-nav";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/utils";
import type { Profile } from "@/lib/types";

export interface NavbarNotification {
  title: string;
  desc: string;
  href?: string;
}

export function Navbar({
  profile,
  notifications,
}: {
  profile: Profile | null;
  notifications: NavbarNotification[];
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  const current = [...primaryNav, ...secondaryNav].find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );

  const displayName = profile?.fullName || "Signed in";
  const displayEmail = profile?.email ?? "";

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <MobileNavContent />
        </SheetContent>
      </Sheet>

      <div className="hidden flex-col sm:flex">
        <p className="font-subheading text-sm font-semibold text-foreground">{current?.label ?? "Overview"}</p>
        <p className="text-xs text-muted-foreground">{current?.description ?? "AFM Lighthouse Church Vryburg"}</p>
      </div>

      <div className="relative ml-auto hidden max-w-sm flex-1 md:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search members, events, ministries…" className="h-10 pl-9" />
      </div>

      <div className="ml-auto flex items-center gap-1.5 sm:ml-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="h-[18px] w-[18px]" />
              {notifications.length > 0 && (
                <Badge className="absolute -right-0.5 -top-0.5 h-4 min-w-4 justify-center rounded-full bg-gold p-0 text-[10px] text-gold-foreground">
                  {notifications.length}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">You are all caught up.</p>
            ) : (
              notifications.map((n, i) => (
                <DropdownMenuItem key={i} className="flex-col items-start gap-0.5" asChild={Boolean(n.href)}>
                  {n.href ? (
                    <Link href={n.href}>
                      <span className="text-sm font-medium">{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.desc}</span>
                    </Link>
                  ) : (
                    <>
                      <span className="text-sm font-medium">{n.title}</span>
                      <span className="text-xs text-muted-foreground">{n.desc}</span>
                    </>
                  )}
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full pr-1 transition-opacity hover:opacity-80">
              <Avatar className="h-9 w-9 border border-border">
                <AvatarImage src="" alt={displayName} />
                <AvatarFallback>{initials(displayName) || "U"}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="flex flex-col gap-0.5">
              <span className="text-sm font-medium text-foreground">{displayName}</span>
              <span className="text-xs font-normal text-muted-foreground">{displayEmail}</span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile" className="cursor-pointer">
                <User className="h-4 w-4" /> My profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <SettingsIcon className="h-4 w-4" /> Church settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <SignOutButton variant="ghost" size="sm" className="w-full justify-start rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive" />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
