"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
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
import { addVisitor } from "@/lib/actions";

const visitorSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email").or(z.literal("")),
  phone: z.string().optional(),
  source: z.string().optional(),
  assignedTo: z.string().optional(),
  prayerRequest: z.string().optional(),
});

type VisitorFormValues = z.infer<typeof visitorSchema>;

export function AddVisitorDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VisitorFormValues>({ resolver: zodResolver(visitorSchema) });

  async function onSubmit(values: VisitorFormValues) {
    try {
      await addVisitor(values);
      toast.success(`${values.name} was registered as a visitor`);
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
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" /> Register visitor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Register a visitor</DialogTitle>
          <DialogDescription>Capture a first-time guest so the team can follow up with them.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" placeholder="Amogelang Botha" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="guest@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" placeholder="+27 82 123 4567" {...register("phone")} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source">How did they find us?</Label>
              <Input id="source" placeholder="Sunday Service, Social Media…" {...register("source")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="assignedTo">Assigned to</Label>
              <Input id="assignedTo" placeholder="Who is following up?" {...register("assignedTo")} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="prayerRequest">Prayer request (optional)</Label>
            <Input id="prayerRequest" placeholder="Any specific prayer needs…" {...register("prayerRequest")} />
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Register visitor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
