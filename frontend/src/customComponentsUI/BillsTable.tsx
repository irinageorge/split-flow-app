import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "react-router-dom";

export type Bill = {
  id: number;
  title: string;
  created_by: string;
  created_on: string;
  is_closed: boolean;
  entries: string[];
  location: string;
  spend: number;
};

type BillsTableProps = {
  bills: Bill[];
  onAddBill: () => void;
  onDeleteBills: (ids: string[]) => void;
  onEditBill: (billId: string) => void;
};

export const BillsTable = ({
  bills,
  onAddBill,
  onDeleteBills,
  onEditBill,
}: BillsTableProps) => {
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelection = (billId: string) => {
    if (!billId) return;

    setSelectedIds((prev) =>
      prev.includes(billId)
        ? prev.filter((id) => id !== billId)
        : [...prev, billId]
    );
  };

  const columns: ColumnDef<Bill>[] = [
    {
      id: "select",
      header: () => <span>Select</span>,
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={selectedIds.includes(row.original.id?.toString() || "")}
          onChange={() => toggleSelection(row.original.id?.toString() || "")}
          disabled={!row.original.id}
        />
      ),
    },
    {
      accessorKey: "title",
      header: "Split bill name",
      cell: ({ row }) => (
        <Link
          to={`/bills/${row.original.id || ""}`}
          className="text-blue-600 underline"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      accessorKey: "created_on",
      header: "Frist created",
    },
    {
      accessorKey: "created_by",
      header: "Created by",
    },
    {
      accessorKey: "spend",
      header: "Spend",
      cell: ({ row }) => {
        const amount = Number(row.original.spend || 0);
        return `$${amount.toFixed(2)}`;
      },
    },
  ];

  const table = useReactTable({
    data: bills || [],
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleDeleteClick = () => {
    onDeleteBills(selectedIds);
    setSelectedIds([]);
  };

  const handleEditClick = () => {
    const billId = selectedIds[0];
    if (selectedIds.length !== 1 || !billId) {
      return;
    }

    onEditBill(billId);
    setSelectedIds([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="Search split bill..."
          value={globalFilter ?? ""}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="max-w-sm"
        />

        <Button style={{ backgroundColor: "#20cd8d" }} onClick={onAddBill}>
          + Add
        </Button>

        <Button
          variant="default"
          disabled={selectedIds.length !== 1}
          onClick={handleEditClick}
        >
          Edit
        </Button>

        <Button
          variant="destructive"
          disabled={selectedIds.length === 0}
          onClick={handleDeleteClick}
        >
          Delete
        </Button>
      </div>

      <div className="overflow-auto rounded-md border">
        <Table>
          <TableHeader style={{ backgroundColor: "#e0e0e0" }}>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} style={{ fontWeight: "bold" }}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center p-4">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
      </div>
    </div>
  );
};
