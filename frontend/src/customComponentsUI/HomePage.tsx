import "./HomePage.css";
import { Bill, BillsTable } from "./BillsTable";
import { useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { useFetchTableData } from "@/services/TableData";
import { useDeleteBill } from "@/services/DeleteBill";
import { setSelectedRowIds } from "@/store/TableData";
import { useQueryClient } from "@tanstack/react-query";
import { useEditBill } from "@/services/useEditBill";

export const HomePage = () => {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { tableData } = useSelector((state: any) => state.tableDataSlice);
  const accountId = useSelector((state: any) => state.authSlice.userId);

  const [bills, setBills] = useState<Bill[]>(tableData);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBillName, setNewBillName] = useState("");
  const [newLocation, setNewLocation] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBillId, setEditingBillId] = useState<string | null>(null);
  const [editBillName, setEditBillName] = useState("");
  const [editLocation, setEditLocation] = useState("");

  const { mutate: createBill } = useCreateNewBill();
  const { mutate: deleteBill } = useDeleteBill(accountId);
  const { data: tableDataFetch, isFetching } = useFetchTableData(accountId);
  const { mutate: editBill } = useEditBill();

  const handleAddBill = () => {
    if (!newBillName) return;
    createBill(
      {
        title: newBillName,
        location: newLocation || "Unknown",
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["tableData", accountId],
          });
          setNewBillName("");
          setNewLocation("");
          setIsAddOpen(false);
        },
      }
    );
  };

  const handleDeleteBills = (ids: string[]) => {
    dispatch(setSelectedRowIds({ rowIds: ids }));
    deleteBill(undefined, {
      onSettled: () => {
        dispatch(setSelectedRowIds({ rowIds: [] }));
      },
    });
  };

  const handleOpenEditModal = (billId: string) => {
    const billToEdit = bills.find((b) => b.id.toString() === billId);
    if (!billToEdit) return;

    setEditingBillId(billToEdit.id.toString());
    setEditBillName(billToEdit.title);
    setEditLocation(billToEdit.location);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingBillId || !editBillName) return;

    editBill(
      {
        bill_id: editingBillId,
        title: editBillName,
        location: editLocation || "Unknown",
      },
      {
        onSuccess: () => {
          setIsEditOpen(false);
          setEditingBillId(null);
        },
      }
    );
  };

  useEffect(() => {
    if (!isFetching && tableDataFetch) {
      setBills(tableDataFetch);
    }
  }, [tableDataFetch, isFetching]);

  return (
    <>
      <div style={{ minHeight: "100vh", backgroundColor: "white" }}>
        <div className="welcome-message">
          Welcome to <strong>SplitFlow</strong>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
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

        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit bill</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input
                placeholder="Bill name"
                value={editBillName}
                onChange={(e) => setEditBillName(e.target.value)}
              />
              <Input
                placeholder="Location"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />
              <Button onClick={handleSaveEdit}>Save changes</Button>
            </div>
          </DialogContent>
        </Dialog>
        <div className="bills-table">
          <BillsTable
            bills={bills}
            onAddBill={() => setIsAddOpen(true)}
            onDeleteBills={handleDeleteBills}
            onEditBill={handleOpenEditModal}
          />
        </div>
      </div>
    </>
  );
};
