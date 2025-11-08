import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

type EditRequest = {
  bill_id: string;
  title: string;
  location: string;
};

type EditResponse = {
  id: number;
  title: string;
  location: string;
};

export function useEditBill() {
  const queryClient = useQueryClient();
  const accountId = useSelector((state: RootState) => state.authSlice.userId);

  return useMutation({
    mutationFn: async ({
      bill_id,
      title,
      location,
    }: EditRequest): Promise<EditResponse> => {
      const res = await fetch(
        `http://127.0.0.1:8000/splitflow/${bill_id}/bill-edit`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            location,
          }),
        }
      );

      if (!res.ok) {
        let msg = "The bill edit failed";
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
      queryClient.invalidateQueries({ queryKey: ["tableData", accountId] });
    },
    retry: false,
  });
}
