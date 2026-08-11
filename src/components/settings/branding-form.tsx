"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { saveBrandColors } from "@/lib/actions";
import { isValidHex } from "@/lib/brand";
import type { BrandColors } from "@/lib/types";

const slots: { key: keyof BrandColors; label: string; hint: string }[] = [
  { key: "primary", label: "Primary — deep royal blue", hint: "Headings, buttons, sidebar" },
  { key: "secondary", label: "Secondary — royal blue", hint: "Links, accents, focus rings" },
  { key: "gold", label: "Accent — gold", hint: "Highlights, badges, certificates" },
];

export function BrandingForm({ initial }: { initial: BrandColors }) {
  const router = useRouter();
  const [colors, setColors] = React.useState<BrandColors>({ ...initial });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  function setColor(key: keyof BrandColors, value: string) {
    if (!value.startsWith("#")) value = `#${value}`;
    setColors((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    for (const { key } of slots) {
      if (!isValidHex(colors[key])) {
        toast.error(`${slots.find((s) => s.key === key)?.label} must be a hex colour like #123E73`);
        return;
      }
    }
    setIsSubmitting(true);
    try {
      await saveBrandColors(colors);
      toast.success("Brand colours saved — applied across the whole system");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save brand colours.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Brand colours</CardTitle>
        <CardDescription>
          These colours are used consistently across the entire system — saved colours apply instantly.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {slots.map(({ key, label, hint }) => (
              <div key={key} className="flex flex-col gap-2 rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <label
                    className="relative h-8 w-8 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-border"
                    style={{ backgroundColor: colors[key] }}
                  >
                    <input
                      type="color"
                      value={isValidHex(colors[key]) ? colors[key] : "#123E73"}
                      onChange={(e) => setColor(key, e.target.value)}
                      className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                    />
                  </label>
                  <div className="min-w-0 flex-1">
                    <Label className="block truncate text-sm font-medium text-foreground">{label}</Label>
                    <p className="text-xs text-muted-foreground">{hint}</p>
                  </div>
                </div>
                <Input
                  value={colors[key]}
                  onChange={(e) => setColor(key, e.target.value)}
                  className="font-mono text-xs uppercase"
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving…" : "Save colours"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
