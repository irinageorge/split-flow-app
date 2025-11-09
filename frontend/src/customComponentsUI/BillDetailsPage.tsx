import { Link, useParams } from "react-router-dom";
import { useFetchBillDetails, BillEntry } from "@/services/useFetchBillDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  AlertTriangle,
  Loader2,
  Pencil,
  Check,
  Plus,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBillEntry } from "@/services/useCreateBillEntry";
import { useDeleteBillEntry } from "@/services/useDeleteBillEntry";
import { useEditBillEntry } from "@/services/useEditBillEntry";

const LoadingSpinner = () => (
  <div className="flex min-h-[400px] w-full items-center justify-center">
    <Loader2 className="h-16 w-16 animate-spin text-gray-500" />
  </div>
);

const ErrorDisplay = ({ message }: { message: string }) => (
  <Alert variant="destructive" className="max-w-lg">
    <AlertTriangle className="h-4 w-4" />
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
);

type BillDetailsContentProps = {
  billId: string;
};

const BillDetailsContent = ({ billId }: BillDetailsContentProps) => {
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<BillEntry | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false);
  const [newNotes, setNewNotes] = useState("");
  const [newAmount, setNewAmount] = useState("");

  const { mutate: editEntry, isPending: isSavingEntry } =
    useEditBillEntry(billId);
  const { mutate: createEntry, isPending: isCreatingEntry } =
    useCreateBillEntry(billId);
  const { mutate: deleteEntry, isPending: isDeletingEntry } =
    useDeleteBillEntry(billId);

  const { data: bill, isPending, isError, error } = useFetchBillDetails(billId);

  if (isPending) {
    return (
      <div className="p-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8">
        <ErrorDisplay message={error?.message || "Could not find bill."} />
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="p-8">
        <ErrorDisplay message="Bill not found." />
      </div>
    );
  }

  const totalSpend = bill.entries.reduce(
    (sum, entry) => sum + Number(entry.amount),
    0
  );

  const formattedDate = new Date(bill.created_on).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleEditEntryClick = (entry: BillEntry) => {
    setCurrentEntry(entry);
    setEditNotes(entry.notes || "");
    setEditAmount(entry.amount.toString());
    setIsEditEntryOpen(true);
  };

  const handleSaveEntryEdit = () => {
    if (!currentEntry) return;
    const amount = parseFloat(editAmount);
    if (!editNotes || isNaN(amount)) return;

    editEntry(
      {
        entry_id: currentEntry.id.toString(),
        notes: editNotes,
        amount: amount,
      },
      {
        onSuccess: () => {
          setIsEditEntryOpen(false);
          setCurrentEntry(null);
        },
      }
    );
  };

  const handleAddEntryClick = () => {
    setNewNotes("");
    setNewAmount("");
    setIsAddEntryOpen(true);
  };

  const handleSaveNewEntry = () => {
    const amount = parseFloat(newAmount);
    if (!newNotes || isNaN(amount) || amount <= 0) {
      console.error("Please enter a valid notes and amount.");
      return;
    }

    createEntry(
      {
        notes: newNotes,
        amount: amount,
      },
      {
        onSuccess: () => {
          setIsAddEntryOpen(false);
        },
      }
    );
  };

  const handleDeleteEntryClick = (entryId: number) => {
    deleteEntry(entryId.toString());
  };

  return (
    <>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="mx-auto max-w-4xl">
          <Button asChild variant="outline" size="sm" className="mb-4">
            <Link to="/home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home page
            </Link>
          </Button>

          <h1 className="mb-2 text-3xl font-bold">{bill.title}</h1>
          <p className="mb-6 text-lg text-gray-500">{bill.location}</p>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Created by:</span>
                  <span>{bill.created_by || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Created on:</span>
                  <span>{formattedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Status:</span>
                  <span
                    className={`font-medium ${
                      bill.is_closed ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    {bill.is_closed ? "Closed" : "Open"}
                  </span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="text-lg font-bold">Total Spend:</span>
                  <span className="text-lg font-bold">
                    ${totalSpend.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Bill entries</CardTitle>
                <Button size="sm" onClick={handleAddEntryClick}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add entry
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Description</TableHead>
                      <TableHead>Added by</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bill.entries.length > 0 ? (
                      bill.entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="font-medium">
                            {entry.notes || "No Description"}
                          </TableCell>
                          <TableCell>{entry.user || "Unknown User"}</TableCell>
                          <TableCell className="text-right">
                            ${Number(entry.amount).toFixed(2)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditEntryClick(entry)}
                              aria-label={`Edit entry ${
                                entry.notes || "No Description"
                              }`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteEntryClick(entry.id)}
                              disabled={isDeletingEntry}
                              aria-label={`Delete entry ${
                                entry.notes || "No Description"
                              }`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={4}
                          className="py-8 text-center text-gray-500"
                        >
                          No entries have been added to this bill yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={2} className="font-bold">
                        Total
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${totalSpend.toFixed(2)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                  </TableFooter>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add new entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-notes" className="text-right">
                Description
              </Label>
              <Input
                id="new-notes"
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-amount" className="text-right">
                Amount
              </Label>
              <Input
                id="new-amount"
                type="number"
                value={newAmount}
                onChange={(e) => setNewAmount(e.target.value)}
                className="col-span-3"
                min="0.01"
                step="0.01"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNewEntry} disabled={isCreatingEntry}>
              {isCreatingEntry && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Plus className="mr-2 h-4 w-4" />
              Add entry
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isEditEntryOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setIsEditEntryOpen(false);
            setCurrentEntry(null);
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit entry</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="notes" className="text-right">
                Description
              </Label>
              <Input
                id="notes"
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={editAmount}
                onChange={(e) => setEditAmount(e.target.value)}
                className="col-span-3"
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Added by</Label>
              <span className="col-span-3 text-sm text-gray-500">
                {currentEntry?.user || "Unknown"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditEntryOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEntryEdit} disabled={isSavingEntry}>
              {isSavingEntry && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              <Check className="mr-2 h-4 w-4" />
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export const BillDetailsPage = () => {
  const { billId } = useParams<{ billId: string }>();

  if (!billId) {
    return (
      <div className="p-8">
        <ErrorDisplay message="No bill ID provided." />
      </div>
    );
  }

  return <BillDetailsContent billId={billId} />;
};
