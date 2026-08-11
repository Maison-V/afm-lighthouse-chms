"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { updateNotificationPrefs } from "@/lib/actions";

const notifDefs = [
  { key: "visitors", label: "New visitor registered", desc: "Notify assigned leaders immediately" },
  { key: "followUp", label: "Follow-up reminders", desc: "Remind leaders 48 hours after a visit" },
  { key: "eventMilestones", label: "Event registration milestones", desc: "Notify organisers at 50%, 80%, and 100% capacity" },
  { key: "weeklySummary", label: "Weekly summary email", desc: "Send a Monday morning digest to leadership" },
];

export function NotificationsForm({ initial }: { initial: Record<string, boolean> }) {
  const router = useRouter();
  const [prefs, setPrefs] = React.useState<Record<string, boolean>>({ ...initial });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await updateNotificationPrefs(prefs);
      toast.success("Notification settings saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save notification settings.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification settings</CardTitle>
        <CardDescription>Choose what you are personally notified about</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col divide-y divide-border">
            {notifDefs.map((n) => (
              <div key={n.key} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch
                  checked={Boolean(prefs[n.key])}
                  onCheckedChange={(checked) => setPrefs((prev) => ({ ...prev, [n.key]: checked }))}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving…" : "Save settings"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
