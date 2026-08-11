"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CertificatePreview } from "@/components/certificates/certificate-preview";
import { generateCertificatePdf } from "@/lib/certificate-pdf";
import { issueCertificate } from "@/lib/actions";
import type { Certificate } from "@/lib/types";

const types: { value: Certificate["type"]; label: string }[] = [
  { value: "baptism", label: "Baptism" },
  { value: "membership", label: "Membership" },
  { value: "marriage", label: "Marriage" },
  { value: "dedication", label: "Dedication" },
  { value: "confirmation", label: "Confirmation" },
];

export function CertificateGenerator() {
  const router = useRouter();
  const [type, setType] = React.useState<Certificate["type"]>("baptism");
  const [recipient, setRecipient] = React.useState("");
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [busy, setBusy] = React.useState(false);

  async function generate(mode: "download" | "print") {
    if (!recipient.trim()) {
      toast.error("Enter the recipient's full name first");
      return;
    }
    setBusy(true);
    try {
      const blob = await generateCertificatePdf({ type, recipient: recipient.trim(), dateIssued: date });
      const url = URL.createObjectURL(blob);
      if (mode === "print") {
        const win = window.open(url, "_blank");
        if (win) win.addEventListener("load", () => win.print());
      } else {
        const a = document.createElement("a");
        a.href = url;
        a.download = `${type}-certificate-${recipient.trim().replace(/\s+/g, "-").toLowerCase()}.pdf`;
        a.click();
      }
      URL.revokeObjectURL(url);
      await issueCertificate({ type, recipient: recipient.trim(), dateIssued: date });
      toast.success(`Certificate issued to ${recipient.trim()}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate the certificate");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle>Generate certificate</CardTitle>
          <CardDescription>Fill in the details — the preview updates as you type</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Certificate type</Label>
            <Select value={type} onValueChange={(v) => setType(v as Certificate["type"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {types.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="recipient">Recipient full name</Label>
            <Input
              id="recipient"
              placeholder="e.g. Naledi Mokoena"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date issued</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>

          <div className="mt-2 flex gap-2">
            <Button variant="outline" className="flex-1 gap-2" disabled={busy} onClick={() => generate("print")}>
              <Printer className="h-4 w-4" /> Print
            </Button>
            <Button className="flex-1 gap-2" disabled={busy} onClick={() => generate("download")}>
              <Download className="h-4 w-4" /> {busy ? "Generating…" : "Download PDF"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col justify-center">
        <CertificatePreview type={type} recipient={recipient} date={date} />
      </div>
    </div>
  );
}
