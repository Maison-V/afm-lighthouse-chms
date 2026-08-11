"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Download, Printer, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Certificate } from "@/lib/types";
import { generateCertificatePdf } from "@/lib/certificate-pdf";
import { deleteCertificate } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

export function CertificatesHistory({ certificates }: { certificates: Certificate[] }) {
  const router = useRouter();

  async function download(cert: Certificate) {
    try {
      const blob = await generateCertificatePdf({
        type: cert.type,
        recipient: cert.recipient,
        dateIssued: cert.dateIssued,
        issuedBy: cert.issuedBy,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${cert.type}-certificate-${cert.recipient.replace(/\s+/g, "-").toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate the PDF");
    }
  }

  async function print(cert: Certificate) {
    try {
      const blob = await generateCertificatePdf({
        type: cert.type,
        recipient: cert.recipient,
        dateIssued: cert.dateIssued,
        issuedBy: cert.issuedBy,
      });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, "_blank");
      if (win) win.addEventListener("load", () => win.print());
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to generate the PDF");
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this certificate record?")) return;
    try {
      await deleteCertificate(id);
      toast.success("Certificate record deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate history</CardTitle>
        <CardDescription>Every certificate issued from this system</CardDescription>
      </CardHeader>
      <CardContent>
        {certificates.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No certificates issued yet — generate the first one above.
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Recipient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Issued</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {certificates.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="text-sm font-medium text-foreground">{c.recipient}</TableCell>
                  <TableCell className="text-sm capitalize text-muted-foreground">{c.type}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{formatDate(c.dateIssued)}</TableCell>
                  <TableCell>
                    <Badge variant={c.status === "issued" ? "success" : "muted"} className="capitalize">
                      {c.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => print(c)} title="Print">
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => download(c)} title="Download PDF">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => remove(c.id)} title="Delete record">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
