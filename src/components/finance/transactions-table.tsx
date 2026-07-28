import { ArrowDownLeft, ArrowUpRight, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { transactions } from "@/lib/mock-data";
import { cn, formatCurrency, formatDate } from "@/lib/utils";

export function TransactionsTable() {
  const recent = [...transactions].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent transactions</CardTitle>
          <CardDescription>Latest income and expenses recorded</CardDescription>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" /> Export
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((t) => (
              <TableRow key={t.id}>
                <TableCell>
                  <div className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-lg",
                        t.type === "income" ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
                      )}
                    >
                      {t.type === "income" ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </span>
                    <span className="text-sm font-medium text-foreground">{t.description}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {t.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm capitalize text-muted-foreground">{t.method}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatDate(t.date)}</TableCell>
                <TableCell
                  className={cn(
                    "text-right text-sm font-semibold",
                    t.type === "income" ? "text-success" : "text-destructive"
                  )}
                >
                  {t.type === "income" ? "+" : "-"}
                  {formatCurrency(t.amount)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
