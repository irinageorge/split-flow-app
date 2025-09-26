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
    id: string;
    billName: string;
    location: string;
    tripDate: string;
    participants: string[];
    status: string;
    totalAmount: string;
    lastUpdated: string;
};

type BillsTableProps = {
    bills: Bill[];
    onAddBill: () => void;
    onDeleteBills: (ids: string[]) => void;
}

export const BillsTable = ({ bills, onAddBill, onDeleteBills }: BillsTableProps) => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [columnFilters, setColumnFilters] = useState<any[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelection = (billId: string) => {
        setSelectedIds((prev) =>
            prev.includes(billId) ? prev.filter((id) => id !== billId) : [...prev, billId]
        );
    };

    const columns: ColumnDef<Bill>[] = [
        {
            id: "select",
            header: () => <span>Select</span>,
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    checked={selectedIds.includes(row.original.id)}
                    onChange={() => toggleSelection(row.original.id)}
                />
            ),
        },
        {
            accessorKey: "billName",
            header: "Split bill name",
            cell: ({ row }) => (
                <Link
                    to={`/bills/${row.original.id}`}
                    className="text-blue-600 underline"
                >
                    {row.original.billName}
                </Link>
            ),
        },
        {
            accessorKey: "location",
            header: "Location",
        },
        {
            accessorKey: "tripDate",
            header: "Trip date",
        },
        {
            accessorKey: "participants",
            header: "Participants",
        },
        {
            accessorKey: "status",
            header: "Status",
        },
        {
            accessorKey: "totalAmount",
            header: "Total spent",
        },
        {
            accessorKey: "lastUpdated",
            header: "Last updated",
        },
    ];

    const table = useReactTable({
        data: bills,
        columns,
        state: {
            globalFilter,
            columnFilters,
        },
        onGlobalFilterChange: setGlobalFilter,
        // onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    return (
        <div className="space-y-4">
            {/* controls */}
            <div className="flex items-center space-x-2">
                <Input
                    placeholder="Search split bill..."
                    value={globalFilter ?? ""}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="max-w-sm"
                />

                {/* <select
                    value={
                        (columnFilters.find((f) => f.id === "status")?.value as string) ||
                        ""
                    }
                    onChange={(e) =>
                        setColumnFilters(
                            e.target.value
                                ? [{ id: "status", value: e.target.value }]
                                : []
                        )
                    }
                    className="border p-1 rounded"
                >
                    <option value="">All Statuses</option>
                    <option value="Future">Future</option>
                    <option value="On-going">On-going</option>
                    <option value="Finished">Finished</option>
                </select> */}

                <Button style={{ backgroundColor: "#20cd8d" }} onClick={onAddBill}>+ Add</Button>

                <Button
                    variant="destructive"
                    disabled={selectedIds.length === 0}
                    onClick={() => onDeleteBills(selectedIds)}
                >
                    Delete
                </Button>
            </div>

            {/* table */}
            <div className="overflow-auto rounded-md border">
                <Table>
                    <TableHeader style={{ backgroundColor: "#eae8e8ff" }}>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} style={{ fontWeight: 'bold' }}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
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
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
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

            {/* pagination */}
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
                    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                </div>
            </div>
        </div>
    );
}
