"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarPlus, Megaphone, Pencil, Archive } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { formatDate } from "@/lib/utils";
import type { Announcement, AnnouncementCategory } from "@/lib/types";

const announcementSchema = z.object({
  title: z.string().min(3, "Give the announcement a title"),
  body: z.string().min(5, "Add a short description"),
  category: z.enum(["service", "event", "notice", "outreach", "social"]),
  startsAt: z.string().min(1, "Pick a date"),
});

type AnnouncementValues = z.infer<typeof announcementSchema>;

const categoryTone: Record<AnnouncementCategory, "gold" | "info" | "default" | "success" | "secondary"> = {
  service: "gold",
  event: "info",
  notice: "default",
  outreach: "success",
  social: "secondary",
};

export function AnnouncementsManager({ announcements, live }: { announcements: Announcement[]; live: boolean }) {
  const [items, setItems] = useState(announcements);
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AnnouncementValues>({
    resolver: zodResolver(announcementSchema),
    defaultValues: { category: "notice" },
  });

  const category = watch("category");

  function upsertLocal(next: Announcement[]) {
    setItems(next.sort((a, b) => b.startsAt.localeCompare(a.startsAt)));
  }

  async function onCreate(values: AnnouncementValues) {
    if (!live) {
      toast.info("Demo mode — connect Supabase to publish real announcements.");
      upsertLocal([
        { id: `local-${Date.now()}`, ...values, published: true },
        ...items,
      ]);
      setDialogOpen(false);
      reset();
      return;
    }

    const supabase = createClient();
    const { data, error } = await supabase
      .from("announcements")
      .insert({
        title: values.title,
        body: values.body,
        category: values.category,
        starts_at: values.startsAt,
        published: true,
      })
      .select("id, title, body, category, starts_at, ends_at, published")
      .single();

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Announcement published.");
    upsertLocal([
      {
        id: data.id,
        title: data.title,
        body: data.body,
        category: data.category,
        startsAt: data.starts_at,
        endsAt: data.ends_at ?? undefined,
        published: data.published,
      },
      ...items,
    ]);
    setDialogOpen(false);
    reset();
  }

  async function onTogglePublished(item: Announcement) {
    const next = { ...item, published: !item.published };
    upsertLocal(items.map((i) => (i.id === item.id ? next : i)));

    if (!live) {
      toast.info(next.published ? "Demo mode — publish requires Supabase." : "Demo mode — archive requires Supabase.");
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from("announcements")
      .update({ published: next.published })
      .eq("id", item.id);
    if (error) toast.error(error.message);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-subheading text-sm font-semibold uppercase tracking-wider text-primary">
              Announcements
            </p>
            <h1 className="mt-1 font-heading text-2xl font-semibold text-foreground">
              Church news & advertisements
            </h1>
            <p className="mt-1 max-w-xl text-sm text-muted-foreground">
              Published announcements appear on the public site for members and visitors.
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="gold" className="gap-2">
                <CalendarPlus className="h-4 w-4" /> New announcement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New announcement</DialogTitle>
                <DialogDescription>
                  It goes live on the public site immediately after publishing.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onCreate)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Youth camp registrations open" {...register("title")} />
                  {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="body">Message</Label>
                  <Input id="body" placeholder="What should the church know?" {...register("body")} />
                  {errors.body && <p className="text-xs text-destructive">{errors.body.message}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label>Category</Label>
                    <Select value={category} onValueChange={(value) => setValue("category", value as AnnouncementCategory)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="service">Service</SelectItem>
                        <SelectItem value="event">Event</SelectItem>
                        <SelectItem value="notice">Notice</SelectItem>
                        <SelectItem value="outreach">Outreach</SelectItem>
                        <SelectItem value="social">Social</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="startsAt">Date</Label>
                    <Input id="startsAt" type="date" {...register("startsAt")} />
                    {errors.startsAt && <p className="text-xs text-destructive">{errors.startsAt.message}</p>}
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold">
                    Publish
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No announcements yet"
          description="Create your first announcement — it will appear on the church's public site."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {items.map((a) => (
            <Card key={a.id} className={!a.published ? "opacity-60" : undefined}>
              <CardContent className="flex flex-col gap-3 p-5">
                <div className="flex items-center justify-between gap-3">
                  <Badge variant={categoryTone[a.category]} className="capitalize">
                    {a.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDate(a.startsAt, { year: undefined })}
                  </span>
                </div>
                <p className="font-subheading text-base font-semibold text-foreground">{a.title}</p>
                <p className="text-sm text-muted-foreground">{a.body}</p>
                <div className="flex items-center gap-2 border-t border-border pt-3">
                  <Badge variant={a.published ? "success" : "outline"}>
                    {a.published ? "Published" : "Archived"}
                  </Badge>
                  <Button variant="ghost" size="sm" className="ml-auto gap-1.5 text-muted-foreground">
                    <Pencil className="h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-muted-foreground"
                    onClick={() => onTogglePublished(a)}
                  >
                    <Archive className="h-3.5 w-3.5" />
                    {a.published ? "Archive" : "Republish"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}