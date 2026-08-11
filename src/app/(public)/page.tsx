import Link from "next/link";
import { ArrowRight, CalendarDays, Clock, MapPin, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getEvents, getMinistries, getPublishedAnnouncements } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { getCurrentProfile } from "@/lib/auth";
import type { AnnouncementCategory } from "@/lib/types";

const categoryBadge: Record<AnnouncementCategory, "gold" | "info" | "default" | "success" | "secondary"> = {
  service: "gold",
  event: "info",
  notice: "default",
  outreach: "success",
  social: "secondary",
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [announcements, events, ministries, profile] = await Promise.all([
    getPublishedAnnouncements(),
    getEvents(),
    getMinistries(),
    getCurrentProfile(),
  ]);

  const upcomingEvents = events
    .filter((e) => e.date >= new Date().toISOString().slice(0, 10))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden bg-sidebar">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(45,110,207,0.22),transparent_60%)]" />
        <div className="pointer-events-none absolute -bottom-24 left-1/2 h-64 w-[40rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center gap-6 px-4 py-20 text-center sm:px-6 sm:py-28">
          <Badge variant="gold" className="gap-2 px-3 py-1 font-normal">
            <Megaphone className="h-3.5 w-3.5" /> Welcome to AFM Lighthouse Church Vryburg
          </Badge>
          <h1 className="max-w-3xl font-heading text-4xl font-semibold leading-tight text-white sm:text-5xl">
            A lighthouse for the community
          </h1>
          <p className="max-w-2xl font-baskerville text-lg italic text-sidebar-foreground/70">
            “Let your light shine before others, that they may see your good deeds and glorify
            your Father in heaven.” — Matthew 5:16
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/events">Join us this Sunday</Link>
            </Button>
            {!profile && (
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
                <Link href="/register">Become a member</Link>
              </Button>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-sm text-sidebar-foreground/60">
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" /> Sundays 09:00
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gold" /> Church Street, Vryburg
            </span>
            <span className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gold" /> Midweek Wednesdays 18:30
            </span>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-subheading text-sm font-semibold uppercase tracking-wider text-primary">
              Announcements
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground">
              What&apos;s happening at the church
            </h2>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          {announcements.map((a) => (
            <Card key={a.id} className="transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={categoryBadge[a.category]} className="capitalize">
                    {a.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(a.startsAt, { year: undefined })}
                  </span>
                </div>
                <p className="font-subheading text-base font-semibold text-foreground">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40">
        <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-subheading text-sm font-semibold uppercase tracking-wider text-primary">
                Upcoming events
              </p>
              <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground">
                Gather with us
              </h2>
            </div>
            <Button asChild variant="outline" className="gap-2">
              <Link href="/events">
                View all events <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
            {upcomingEvents.length === 0 ? (
              <div className="col-span-full rounded-card border border-border p-8 text-center text-sm text-muted-foreground">
                The next gathering is being planned — join us for Sunday service at 09:00.
              </div>
            ) : (
              upcomingEvents.map((event) => (
                <Card key={event.id} className="transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
                  <CardContent className="flex flex-col gap-4 p-5">
                    <div className="flex items-center justify-between">
                      <Badge variant="gold" className="capitalize">
                        {event.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(event.date, { year: undefined })} · {event.time}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-subheading text-base font-semibold text-foreground">
                        {event.title}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-subheading text-sm font-semibold uppercase tracking-wider text-primary">
              Ministries
            </p>
            <h2 className="mt-1 font-heading text-2xl font-semibold text-foreground">
              Find your place to serve
            </h2>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <Link href="/ministries">
              Explore ministries <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ministries.length === 0 ? (
            <div className="col-span-full rounded-card border border-border p-8 text-center text-sm text-muted-foreground">
              Ministries are being launched — check back soon.
            </div>
          ) : (
            ministries.slice(0, 3).map((m) => (
              <Card key={m.id} className="transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
                <CardContent className="flex flex-col gap-3 p-5">
                  <p className="font-subheading text-base font-semibold text-foreground">{m.name}</p>
                  <p className="text-sm text-muted-foreground">{m.description}</p>
                  <div className="flex items-center gap-1.5 border-t border-border pt-3 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {m.meetingSchedule || "Schedule TBA"}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}