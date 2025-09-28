import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export function useDeleteBill(accountId: string | number) {
  const queryClient = useQueryClient();
  const selectedRowIds = useSelector(
    (state: any) => state.tableDataSlice.selectedRowIds
  );

  return useMutation({
    mutationFn: async (): Promise<{ detail: string }> => {
      if (!selectedRowIds || selectedRowIds.length === 0) {
        throw new Error("No bills selected for deletion");
      }

      const res = await fetch(
        `http://127.0.0.1:8000/splitflow/bills/leave/${accountId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ bill_ids: selectedRowIds.map(Number) }),
        }
      );

      if (!res.ok) {
        let msg = "The deletion of the bill failed";
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
