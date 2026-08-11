import Link from "next/link";
import { MapPin, Clock, Mail } from "lucide-react";
import { ChurchLogo } from "@/components/shared/church-logo";

export function SiteFooter({ logoUrl }: { logoUrl?: string | null }) {
  return (
    <footer className="border-t border-border bg-sidebar">
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-12 sm:grid-cols-3 sm:px-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9">
              <ChurchLogo logoUrl={logoUrl} />
            </div>
            <div>
              <p className="font-heading text-sm font-semibold text-white">AFM Lighthouse</p>
              <p className="text-[11px] text-sidebar-foreground/60">Church · Vryburg</p>
            </div>
          </div>
          <p className="max-w-xs text-sm text-sidebar-foreground/60">
            A lighthouse for the community — worship, fellowship, and service in Vryburg,
            North West.
          </p>
        </div>

        <div className="flex flex-col gap-3 text-sm text-sidebar-foreground/70">
          <p className="font-subheading text-sm font-semibold text-white">Service times</p>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" /> Sunday morning — 09:00
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" /> Midweek service — Wednesday 18:30
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gold" /> Friday worship — 18:00
          </span>
        </div>

        <div className="flex flex-col gap-3 text-sm text-sidebar-foreground/70">
          <p className="font-subheading text-sm font-semibold text-white">Contact</p>
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" /> Church Street, Vryburg, North West
          </span>
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gold" /> office@afmlighthouse.church
          </span>
          <Link href="/events" className="text-gold hover:underline">
            See what&apos;s coming up
          </Link>
        </div>
      </div>
      <div className="border-t border-sidebar-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-sidebar-foreground/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 AFM Lighthouse Church Vryburg. All rights reserved.</p>
          <p className="font-baskerville italic">“You are the light of the world.” — Matthew 5:14</p>
        </div>
      </div>
    </footer>
  );
}