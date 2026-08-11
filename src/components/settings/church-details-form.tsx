"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LighthouseMark } from "@/components/shared/lighthouse-mark";
import { saveChurchDetails, uploadChurchLogo } from "@/lib/actions";
import type { ChurchSettings } from "@/lib/types";

export function ChurchDetailsForm({ settings }: { settings: ChurchSettings }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { register, handleSubmit } = useForm<Omit<ChurchSettings, "brandColors">>({
    defaultValues: {
      churchName: settings.churchName,
      denomination: settings.denomination,
      address: settings.address,
      phone: settings.phone,
      email: settings.email,
      seniorPastor: settings.seniorPastor,
    },
  });

  async function onSubmit(values: Omit<ChurchSettings, "brandColors">) {
    setIsSubmitting(true);
    try {
      await saveChurchDetails(values);
      toast.success("Church details saved");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save church details.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onLogoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("logo", file);
      await uploadChurchLogo(formData);
      toast.success("Logo updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not upload the logo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Church details</CardTitle>
        <CardDescription>Basic information used across certificates, receipts, and reports</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0">
              {settings.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={settings.logoUrl} alt="Church logo" className="h-16 w-16 rounded-lg border border-border object-contain" />
              ) : (
                <LighthouseMark />
              )}
            </div>
            <div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onLogoChange} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {isUploading ? <Upload className="h-4 w-4 animate-pulse" /> : <Upload className="h-4 w-4" />}
                {isUploading ? "Uploading…" : "Upload new logo"}
              </Button>
              <p className="mt-1.5 text-xs text-muted-foreground">SVG or PNG, at least 256×256px, under 2 MB</p>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="churchName">Church name</Label>
              <Input id="churchName" {...register("churchName")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="denomination">Denomination</Label>
              <Input id="denomination" {...register("denomination")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="address">Physical address</Label>
              <Input id="address" {...register("address")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="phone">Church phone</Label>
              <Input id="phone" {...register("phone")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">Church email</Label>
              <Input id="email" {...register("email")} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="pastor">Senior pastor</Label>
              <Input id="pastor" {...register("seniorPastor")} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              <Save className="h-4 w-4" />
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
