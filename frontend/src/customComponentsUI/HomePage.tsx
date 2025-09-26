import "./HomePage.css";
import { Bill, BillsTable } from "./BillsTable";
import { useState } from "react";
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
import { dummyBills } from "@/store/dummyData";
import { BillBySpending } from "./BillBySpending";

export const HomePage = () => {

    const [bills, setBills] = useState<Bill[]>(dummyBills);
    const [isOpen, setIsOpen] = useState(false);
    const [newBillName, setNewBillName] = useState("");
    const [newLocation, setNewLocation] = useState("");

    const { mutate: createBill, data, isPending, error } = useCreateNewBill();

    const handleAddBill = () => {
        if (!newBillName) return;

        createBill(
            { title: newBillName, account_id: 10 },
            {
                onSuccess: (res) => {
                    setBills((prev) => [
                        ...prev,
                        {
                            id: String(res.id),
                            billName: res.title,
                            location: newLocation || "Unknown",
                            tripDate: "Unknown",
                            participants: [],
                            status: res.is_closed ? "Finished" : "On-going",
                            paymentStatus: "Unknown",
                            totalAmount: "$0.00",
                            lastUpdated: "Unknown",
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
        setBills((prev) => prev.filter((bill) => !ids.includes(bill.id)));
    };

    return (
        <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
            <div className="welcome-message">
                Welcome to <strong>SplitFlow</strong>
            </div>

            <div className="flex flex-wrap gap-1 pt-15 px-10 justify-center">
                <div className="h-[350px]">
                    <BillsByStatusChart bills={bills} />
                </div>
                <div className="h-[350px]">
                    <BillBySpending bills={bills} />
                </div>
            </div>

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
