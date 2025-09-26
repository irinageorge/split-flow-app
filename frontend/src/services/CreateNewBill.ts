import { useMutation } from "@tanstack/react-query";

type CreateRequest = { title: string; account_id: number };
type CreateResponse = {
  id: number;
  title: string;
  created_by: number;
  created_on: string;
  is_closed: boolean;
  entries: any[];
};

export function useCreateNewBill() {
  return useMutation({
    mutationFn: async ({
      title,
      account_id,
    }: CreateRequest): Promise<CreateResponse> => {
      const res = await fetch("http://127.0.0.1:8000/splitflow/bills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, account_id }),
      });

      if (!res.ok) {
        let msg = "The new bill creation failed";
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
    retry: false,
  });
}
