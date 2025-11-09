import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type EditEntryRequest = {
  entry_id: string;
  notes: string;
  amount: number;
};

type EditEntryResponse = {
  id: number;
  notes: string;
  amount: number;
  user: string;
};

export function useEditBillEntry(billId: string) {
  const queryClient = useQueryClient();
  const accountId = useSelector((state: RootState) => state.authSlice.userId);

  return useMutation({
    mutationFn: async ({
      entry_id,
      notes,
      amount,
    }: EditEntryRequest): Promise<EditEntryResponse> => {
      const res = await fetch(
        `http://127.0.0.1:8000/splitflow/${entry_id}/bill-entries/edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            notes,
            amount,
            account_id: accountId,
          }),
        }
      );

      if (!res.ok) {
        let msg = "The bill entry edit failed";
        try {
          const data = await res.json();
          msg = data.error || data.message || JSON.stringify(data);
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["billDetails", billId] });
    },
    retry: false,
  });
}
