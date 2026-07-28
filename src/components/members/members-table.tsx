"use client";

import * as React from "react";
import Link from "next/link";
import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Search, Users } from "lucide-react";
import type { Member } from "@/lib/types";
import { cn, formatDate, initials } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/shared/empty-state";

const statusTone: Record<Member["status"], "success" | "muted" | "gold" | "info"> = {
  active: "success",
  inactive: "muted",
  new: "gold",
  transferred: "info",
};

function SortableHeader({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button className="flex items-center gap-1.5 hover:text-foreground" onClick={onClick}>
      {label}
      <ArrowUpDown className="h-3 w-3" />
    </button>
  );
}

const columns: ColumnDef<Member>[] = [
  {
    accessorKey: "firstName",
    header: ({ column }) => (
      <SortableHeader label="Member" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ row }) => {
      const m = row.original;
      return (
        <Link href={`/members/${m.id}`} className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials(`${m.firstName} ${m.lastName}`)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {m.firstName} {m.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{m.email}</p>
          </div>
        </Link>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={statusTone[row.original.status]} className="capitalize">
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: "ministries",
    header: "Ministries",
    cell: ({ row }) => (
      <div className="flex max-w-[220px] flex-wrap gap-1">
        {row.original.ministries.map((m) => (
          <Badge key={m} variant="outline" className="font-normal">
            {m}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    accessorKey: "attendanceRate",
    header: ({ column }) => (
      <SortableHeader label="Attendance" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ row }) => (
      <div className="flex w-32 items-center gap-2">
        <Progress value={row.original.attendanceRate} className="h-1.5" />
        <span className="w-8 shrink-0 text-xs text-muted-foreground">{row.original.attendanceRate}%</span>
      </div>
    ),
  },
  {
    accessorKey: "joinedAt",
    header: ({ column }) => (
      <SortableHeader label="Joined" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
    ),
    cell: ({ row }) => <span className="text-sm text-muted-foreground">{formatDate(row.original.joinedAt)}</span>,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link href={`/members/${row.original.id}`}>View profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Edit details</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">Archive member</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export function MembersTable({ data }: { data: Member[] }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");

  const filtered = React.useMemo(
    () => (statusFilter === "all" ? data : data.filter((m) => m.status === statusFilter)),
    [data, statusFilter]
  );

  const table = useReactTable({
    data: filtered,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _columnId, filterValue) => {
      const m = row.original;
      const haystack = `${m.firstName} ${m.lastName} ${m.email} ${m.phone}`.toLowerCase();
      return haystack.includes(String(filterValue).toLowerCase());
    },
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, phone…"
            className="pl-9"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <SelectValue placeholder="Filter status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="transferred">Transferred</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Users} title="No members found" description="Try adjusting your search or filters." />
      ) : (
        <>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id}>
                  {hg.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} · {filtered.length} members
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
