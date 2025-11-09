import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type CreateEntryRequest = {
  notes: string;
  amount: number;
};
type CreateEntryResponse = {
  id: number;
  notes: string;
  amount: number;
  user: string;
  bill: number;
};

export function useCreateBillEntry(billId: string) {
  const queryClient = useQueryClient();
  const accountId = useSelector((state: RootState) => state.authSlice.userId);

  return useMutation({
    mutationFn: async ({
      notes,
      amount,
    }: CreateEntryRequest): Promise<CreateEntryResponse> => {
      const res = await fetch(
        `http://127.0.0.1:8000/splitflow/${billId}/bills/entries`,
        {
          method: "POST",
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
        let msg = "Failed to create new bill entry";
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
