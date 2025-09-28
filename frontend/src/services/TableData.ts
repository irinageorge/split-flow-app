import { useQuery } from "@tanstack/react-query";
import { useSelector } from "react-redux";

export function useFetchTableData(accountId: number) {
  const rowIds = useSelector(
    (state: any) => state.tableDataSlice.selectedRowIds
  );

  return useQuery({
    queryKey: ["tableData", accountId],
    queryFn: async () => {
      const response = await fetch(
        `http://127.0.0.1:8000/splitflow/bills_by_user/${accountId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bills");
      }
      return response.json();
    },

    enabled: !!accountId,
  });
}
