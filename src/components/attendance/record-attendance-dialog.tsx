"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ClipboardCheck } from "lucide-react";
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
import { recordAttendance } from "@/lib/actions";

const attendanceSchema = z.object({
  date: z.string().min(1, "Pick a date"),
  service: z.string().min(2, "Service name is required"),
  men: z.coerce.number().int().min(0).default(0),
  women: z.coerce.number().int().min(0).default(0),
  children: z.coerce.number().int().min(0).default(0),
  visitors: z.coerce.number().int().min(0).default(0),
});

type AttendanceFormValues = z.infer<typeof attendanceSchema>;

export function RecordAttendanceDialog() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AttendanceFormValues>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      date: new Date().toISOString().slice(0, 10),
      service: "Sunday Morning Service",
      men: 0,
      women: 0,
      children: 0,
      visitors: 0,
    },
  });

  async function onSubmit(values: AttendanceFormValues) {
    try {
      await recordAttendance(values);
      toast.success("Attendance recorded");
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
          <ClipboardCheck className="h-4 w-4" /> Record attendance
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record attendance</DialogTitle>
          <DialogDescription>Count the heads after the service — men, women, children, and visitors.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="att-date">Date</Label>
              <Input id="att-date" type="date" {...register("date")} />
              {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="att-service">Service</Label>
              <Input id="att-service" placeholder="Sunday Morning Service" {...register("service")} />
              {errors.service && <p className="text-xs text-destructive">{errors.service.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(["men", "women", "children", "visitors"] as const).map((field) => (
              <div key={field} className="flex flex-col gap-1.5">
                <Label htmlFor={`att-${field}`} className="capitalize">
                  {field}
                </Label>
                <Input id={`att-${field}`} type="number" min={0} {...register(field)} />
                {errors[field] && <p className="text-xs text-destructive">{errors[field]?.message}</p>}
              </div>
            ))}
          </div>

          <DialogFooter className="mt-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Record attendance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
