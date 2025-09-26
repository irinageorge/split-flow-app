import './HomePage.css'
import { Bill, BillsTable } from "./BillsTable";
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCreateNewBill } from '@/services/CreateNewBill';


export const HomePage = () => {
    const [bills, setBills] = useState<Bill[]>([]);
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
                            status: res.is_closed ? "Finished" : "On-going",
                            paymentMethod: "N/A",
                            totalAmount: "$0.00",
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

    return <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <div className="welcome-message">
            Welcome to <strong>SplitFlow</strong>
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

        <div className='bills-table'>
            <BillsTable
                bills={bills}
                onAddBill={() => setIsOpen(true)}
                onDeleteBills={handleDeleteBills}
            />
        </div>
    </div>
}
