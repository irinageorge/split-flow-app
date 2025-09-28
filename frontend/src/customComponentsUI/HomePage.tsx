import "./HomePage.css";
import { Bill, BillsTable } from "./BillsTable";
import { use, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateNewBill } from "@/services/CreateNewBill";
import { BillsByStatusChart } from "./BillsByStatusChart";
import { BillBySpending } from "./BillBySpending";
import { useDispatch, useSelector } from "react-redux";
import { useFetchTableData } from "@/services/TableData";
import { useDeleteBill } from "@/services/DeleteBill";
import { setSelectedRowIds } from "@/store/TableData";

export const HomePage = () => {

    const dispatch = useDispatch();

    const { tableData } = useSelector((state: any) => state.tableDataSlice);
    const accountId = useSelector((state: any) => state.authSlice.userId);
    const rowIds = useSelector((state: any) => state.tableDataSlice.selectedRowIds);

    const [bills, setBills] = useState<Bill[]>(tableData);
    const [isOpen, setIsOpen] = useState(false);
    const [newBillName, setNewBillName] = useState("");
    const [newLocation, setNewLocation] = useState("");

    const { mutate: createBill } = useCreateNewBill();
    const { mutate: deleteBill } = useDeleteBill(accountId);
    const { data: tableDataFetch, isFetching, } = useFetchTableData(accountId);

    const handleAddBill = () => {
        if (!newBillName) return;

        createBill(
            { title: newBillName, account_id: 10 },
            {
                onSuccess: (res) => {
                    setBills((prev) => [
                        ...prev,
                        {
                            id: res.id,
                            title: res.title,
                            created_by: "Unknown",
                            created_on: "Unknown",
                            is_closed: res.is_closed,
                            entries: [],
                            location: newLocation || "Unknown",
                            spend: 0,
                        },
                    ]);

                    setNewBillName("");
                    setNewLocation("");
                    setIsOpen(false);
                },
            }
        );
    };

    const handleDeleteBills = (ids: string[]) => {
        dispatch(setSelectedRowIds({ rowIds: ids }));
        deleteBill();
    };

    useEffect(() => {
        if (!isFetching && tableDataFetch) {
            setBills(tableDataFetch)
        }
    }, [tableDataFetch, isFetching]);


    return (
        <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
            <div className="welcome-message">
                Welcome to <strong>SplitFlow</strong>
            </div>
            {/* 
            <div className="flex flex-wrap gap-1 pt-15 px-10 justify-center">
                <div className="h-[350px]">
                    <BillsByStatusChart bills={bills} />
                </div>
                <div className="h-[350px]">
                    <BillBySpending bills={bills} />
                </div>
            </div> */}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Add new bill to your dashboard</DialogTitle>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <Input
                            placeholder="Bill name"
                            value={newBillName}
                            onChange={(e) => setNewBillName(e.target.value)}
                        />
                        <Input
                            placeholder="Location"
                            value={newLocation}
                            onChange={(e) => setNewLocation(e.target.value)}
                        />
                        <Button onClick={handleAddBill}>Add bill</Button>
                    </div>
                </DialogContent>
            </Dialog>

            <div className="bills-table">
                <BillsTable
                    bills={bills}
                    onAddBill={() => setIsOpen(true)}
                    onDeleteBills={handleDeleteBills}
                />
            </div>
        </div>
    );
};
