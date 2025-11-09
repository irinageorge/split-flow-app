import { useQuery } from "@tanstack/react-query";

export type BillEntry = {
  id: number;
  notes: string;
  amount: number;
  user: string;
};

export type BillDetail = {
  id: number;
  title: string;
  location: string;
  created_on: string;
  created_by: string;
  is_closed: boolean;
  entries: BillEntry[];
};

async function fetchBillDetails(billId: string): Promise<BillDetail> {
  const res = await fetch(
    `http://127.0.0.1:8000/splitflow/${billId}/bill-details`
  );

  if (!res.ok) {
    let msg = "Failed to fetch bill details";
    try {
      const data = await res.json();
      msg = data.error || data.message || JSON.stringify(data);
    } catch {
      msg = await res.text();
    }
    throw new Error(msg);
  }

  return res.json();
}

export function useFetchBillDetails(billId: string) {
  return useQuery({
    queryKey: ["billDetails", billId],
    queryFn: () => fetchBillDetails(billId),
    enabled: !!billId,
    retry: false,
  });
}
