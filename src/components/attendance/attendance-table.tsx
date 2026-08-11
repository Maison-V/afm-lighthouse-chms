"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AttendanceRecord } from "@/lib/types";
import { deleteAttendance } from "@/lib/actions";
import { formatDate } from "@/lib/utils";

export function AttendanceTable({ data }: { data: AttendanceRecord[] }) {
  const router = useRouter();
  const rows = [...data].sort((a, b) => (a.date < b.date ? 1 : -1));

  async function remove(id: string) {
    if (!confirm("Delete this attendance record?")) return;
    try {
      await deleteAttendance(id);
      toast.success("Record deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service records</CardTitle>
        <CardDescription>A full breakdown of attendance by category, per service</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Men</TableHead>
              <TableHead className="text-right">Women</TableHead>
              <TableHead className="text-right">Children</TableHead>
              <TableHead className="text-right">Visitors</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="text-sm font-medium text-foreground">{a.service}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(a.date)}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{a.men}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{a.women}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{a.children}</TableCell>
                <TableCell className="text-right text-sm text-muted-foreground">{a.visitors}</TableCell>
                <TableCell className="text-right">
                  <Badge variant="default" className="font-semibold">
                    {a.total}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => remove(a.id)}>
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
