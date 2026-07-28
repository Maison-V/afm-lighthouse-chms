import { Download, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { certificates } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export function CertificatesHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificate history</CardTitle>
        <CardDescription>Every certificate issued from this system</CardDescription>
      </CardHeader>
      <CardContent>
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
