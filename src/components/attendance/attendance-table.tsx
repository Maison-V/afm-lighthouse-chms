import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { attendance } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

export function AttendanceTable() {
  const rows = [...attendance].sort((a, b) => (a.date < b.date ? 1 : -1));

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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
