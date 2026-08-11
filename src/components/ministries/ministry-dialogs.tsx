"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { createMinistry, updateMinistry, deleteMinistry } from "@/lib/actions";
import type { Ministry } from "@/lib/types";

const ministrySchema = z.object({
  name: z.string().min(2, "Ministry name is required"),
  description: z.string().min(5, "Add a short description"),
  leader: z.string().optional(),
  meetingSchedule: z.string().optional(),
  color: z.string().optional(),
  upcomingEvent: z.string().optional(),
});

type MinistryFormValues = z.infer<typeof ministrySchema>;

const defaultColors = ["#2D6ECF", "#C9A227", "#123E73", "#DC2626", "#2563EB", "#16A34A", "#F59E0B", "#6B7280"];

export function CreateMinistryDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<MinistryFormValues>({ resolver: zodResolver(ministrySchema) });

  const selectedColor = watch("color");

  async function onSubmit(values: MinistryFormValues) {
    try {
      await createMinistry(values);
      toast.success(`${values.name} was created`);
      reset();
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="gold">Create ministry</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a ministry</DialogTitle>
          <DialogDescription>Add a team or department to the church family.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="min-name">Ministry name</Label>
            <Input id="min-name" placeholder="Youth Ministry" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="min-desc">Description</Label>
            <Input id="min-desc" placeholder="What does this ministry do?" {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="min-leader">Leader</Label>
              <Input id="min-leader" placeholder="Pastor Kabelo Sithole" {...register("leader")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="min-schedule">Meeting schedule</Label>
              <Input id="min-schedule" placeholder="Fridays, 18:00" {...register("meetingSchedule")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Colour</Label>
            <div className="flex gap-2">
              {defaultColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                    selectedColor === c ? "border-foreground" : "border-transparent"
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setValue("color", c)}
                />
              ))}
            </div>
            <input type="hidden" {...register("color")} />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create ministry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditMinistryDialog({ ministry }: { ministry: Ministry }) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<MinistryFormValues>({
    resolver: zodResolver(ministrySchema),
    defaultValues: {
      name: ministry.name,
      description: ministry.description,
      leader: ministry.leader,
      meetingSchedule: ministry.meetingSchedule,
      color: ministry.color,
      upcomingEvent: ministry.upcomingEvent,
    },
  });

  async function onSubmit(values: MinistryFormValues) {
    try {
      await updateMinistry(ministry.id, values);
      toast.success("Ministry updated");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  async function remove() {
    if (!confirm(`Delete the ${ministry.name} ministry? This cannot be undone.`)) return;
    try {
      await deleteMinistry(ministry.id);
      toast.success("Ministry deleted");
      setOpen(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Manage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage {ministry.name}</DialogTitle>
          <DialogDescription>Update the ministry&apos;s details shown on the site.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-name">Ministry name</Label>
            <Input id="edit-name" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-desc">Description</Label>
            <Input id="edit-desc" {...register("description")} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-leader">Leader</Label>
              <Input id="edit-leader" {...register("leader")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="edit-schedule">Meeting schedule</Label>
              <Input id="edit-schedule" {...register("meetingSchedule")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="edit-event">Upcoming event</Label>
            <Input id="edit-event" placeholder="e.g. Ministry planning meeting — this Thursday" {...register("upcomingEvent")} />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" className="text-destructive hover:text-destructive" onClick={remove}>
              Delete
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
