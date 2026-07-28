"use client";

import { Plus, UserPlus, CalendarPlus, HandCoins } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Fab() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-soft-lg transition-transform active:scale-95 lg:hidden"
          aria-label="Quick actions"
        >
          <Plus className="h-6 w-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Quick actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2">
          <UserPlus className="h-4 w-4" /> Register a visitor
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <CalendarPlus className="h-4 w-4" /> Create an event
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2">
          <HandCoins className="h-4 w-4" /> Record a gift
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
